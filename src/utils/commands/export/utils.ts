import * as fs from 'fs'
import { parse } from 'json2csv'
import * as moment from 'moment'
import { EOL } from 'os'

import { TimetrackingValidator } from './validators'

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
   * Filter timetracking data from params
   */
  public filterData(tools: any, params: any, timetracking: Array<any>) {
    return timetracking.reduce((acc: Array<any>, tracking: any) => {
      let valid: boolean | string = new TimetrackingValidator().isValid(
        tracking, params
      )
      if (valid) {
        tracking = this.formatTimetracking(tracking)
      }
      return valid ? acc.concat([tracking]) : acc
    }, [])
  }

  /**
   * Aggregate time tracking
   */
  public aggregateData(tools: any, filteredData: Array<any>) {
    return filteredData.reduce((acc: Array<any>, tracking: any) => {
      const startDate = moment(tracking.start, 'DD/MM/YYYY HH:mm')
      const formattedStartDate = startDate.format('DD/MM/YYYY')
      const trackingAsArray = [tracking]
      if (formattedStartDate in acc) {
        acc[formattedStartDate] = acc[formattedStartDate].concat(
          trackingAsArray
        )
      } else {
        acc[formattedStartDate] = trackingAsArray
      }
      return acc
    }, {})
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
   * Format timetracking to standart format
   */
  private formatTimetracking(tracking: any) {
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
      description,
      start: startDate.format(formatDatetime),
      end: endDate.format(formatDatetime),
      duration: moment({
        hour: duration.hours(),
        minute: duration.minutes()
      }).format('HH:mm')
    }
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
    const headers = ['description', 'start', 'end', 'duration']
    try {
      return parse(data, { fields: headers })
    } catch (err) {
      // FIXME handle error (err)
    }
  }
}
