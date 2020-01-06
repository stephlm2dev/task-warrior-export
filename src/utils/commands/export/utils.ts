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
   * Aggregate time tracking for stats
   */
  public aggregateData(tools: any, filteredData: Array<any>) {
    const totalDurations = filteredData.reduce(this.aggregatePerDay, {})
    const totalDurationsAsArray = Object.keys(totalDurations).map(
      trackingDate => {
        const [hours, minutes] = totalDurations[trackingDate].split(':')
        return {
          date: trackingDate,
          total: `${parseInt(hours, 10)}h ${minutes}min`,
          human: this.convertToManHours(totalDurations[trackingDate])
        }
      }
    )
    const total = totalDurationsAsArray.reduce(this.totalAggregate, {
      total: 0, human: 0
    })
    return totalDurationsAsArray.concat([total])
  }

  /**
   * Save file on disk
   */
  public saveFile(data: Array<any>, params: any, prefix: string) {
    // #neurodecisions$2019-01-12$2019-12-12.csv
    const format = params.format
    const fromDate = params.from.replace(/-/g, '')
    const toDate = params.to.replace(/-/g, '')
    const project = params.project.replace(/[^a-zA-Z ]/g, '')
    const filename = `${project}-${fromDate}-${toDate}-${prefix}.${format}`
    let writeData = null
    if (format === 'json') {
      writeData = this.formatAsJson(data)
    } else if (format === 'csv') {
      writeData = this.formatAsCsv(data, prefix)
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
  private formatAsCsv(data, prefix) {
    let headers = null
    if (prefix === 'raw') {
      headers = ['description', 'start', 'end', 'duration']
    } else {
      headers = ['date', 'total', 'human']
    }
    try {
      return parse(data, { fields: headers })
    } catch (err) {
      // FIXME handle error (err)
    }
  }

  /**
   * Aggregate time tracking per day
   */
  private aggregatePerDay(acc: any, tracking: any) {
    const startDate = moment(tracking.start, 'DD/MM/YYYY HH:mm')
    const formattedStartDate = startDate.format('DD/MM/YYYY')
    if (formattedStartDate in acc) {
      const duration = moment.duration(acc[formattedStartDate]).add(
        moment.duration(tracking.duration)
      )
      acc[formattedStartDate] = moment({
        hour: duration.hours(),
        minute: duration.minutes()
      }).format('HH:mm')
    } else {
      acc[formattedStartDate] = tracking.duration
    }
    return acc
  }

  /**
   * Convert duration in hours to man hours
   * 0,25 -> 2h
   * 0,50 -> 4h (half day)
   * 0,75 -> 6h
   * 1,00 -> 8h (full day)
   */
  private convertToManHours(duration: string) {
    const decimalHours = moment.duration(duration).asHours()
    const rawManHours = (decimalHours * 0.25) / 2
    let roundedManHours = 0
    if (rawManHours <= 0.25) {
      roundedManHours = 0.25
    } else if (rawManHours > 0.25 && rawManHours <= 0.5) {
      roundedManHours = 0.5
    } else if (rawManHours > 0.5 && rawManHours <= 0.75) {
      roundedManHours = 0.75
    } else if (rawManHours > 0.75) {
      roundedManHours = 1
    }
    return roundedManHours
  }

  /**
   * Total aggregate of all time tracking
   */
  private totalAggregate(acc: any, trackingStats: any) {
    // FIXME issue with total
    return {
      total: acc.total,
      human: acc.human + trackingStats.human
    }
  }
}
