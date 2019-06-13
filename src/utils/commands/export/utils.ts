import * as fs from 'fs'
import { parse } from 'json2csv'
import * as moment from 'moment'
import { EOL } from 'os'

export default class ExportUtils {
  constructor() {}

  /**
   * CLI flags of 'export' commands
   * Filter 'help' command
   */
  public availableFlags(flags: any) {
    return Object.keys(flags).filter((el, _index, _array) => {
      return el !== 'help'
    })
  }

  /**
   * Format timetracking to standart format
   */
  public formatTimetracking(tracking: any) {
    // {
    //  "start":"20190612T150556Z",
    //  "end":"20190612T170000Z",
    //  "tags":["#sideproject","Task/time warrior export"]
    // }
    const startDate = moment(tracking.start)
    const endDate = moment(tracking.end)
    const duration = moment.duration(endDate.diff(startDate))
    const formatDatetime = 'DD/MM/YYYY HH:mm'

    const [project, description, ...tags] = tracking.tags
    return {
      start: startDate.format(formatDatetime),
      end: endDate.format(formatDatetime),
      duration: moment({
        hour: duration.hours(),
        minute: duration.minutes()
      }).format('HH:mm'),
      project,
      description
    }
  }

  /**
   * Save file on disk
   */
  public saveFile(data: Array<any>, params: any) {
    // #neurodecisions$2019-01-12$2019-12-12.csv
    const fromDate = params.from.replace(/-/g, '')
    const toDate = params.to.replace(/-/g, '')
    const project = params.project.replace(/[^a-zA-Z ]/g, '')
    const filename = `${project}-${fromDate}-${toDate}.${params.format}`
    let writeData = null
    if (params.format === 'json') {
      writeData = this.formatAsJson(data)
    } else if (params.format === 'csv') {
      writeData = this.formatAsCsv(data)
    }
    try {
      fs.writeFileSync(filename, writeData)
      return true
    } catch (err) {
      // FIXME handle error (err)
    }
  }

  /**
   * Format error message
   */
  public errorMessage(singularTitle: string, errorList: Array<string>) {
    const plural = (errorList.length > 1) ? 's' : ''
    const title = `${singularTitle}${plural}`
    const details = errorList.map((error: string) => {
      return `• ${error}`
    }).join(EOL)
    return `${title}${EOL}${details}`
  }

  /**
   * Stringify data
   */
  private formatAsJson(data) {
    return JSON.stringify(data)
  }

  /**
   * Convert JSON as CSV
   */
  private formatAsCsv(data) {
    const headers = ['start', 'end', 'duration', 'project', 'description']
    try {
      return parse(data, { fields: headers })
    } catch (err) {
      // FIXME handle error (err)
    }
  }
}
