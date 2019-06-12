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
      duration: 'FIXME duration method format HH:mm:'
      project,
      description
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
}
