import * as Moment from 'moment'
import { extendMoment } from 'moment-range'

import { Validator } from './validator'

/**
 * Validation for timetracking
 */
export default class TimetrackingValidator implements Validator {
  public isValid(tracking: any, filters: any) {
    // {
    //  "start":"20190612T150556Z",
    //  "end":"20190612T170000Z",
    //  "tags":["#sideproject","Task/time warrior export"]
    // }
    let inInterval = false
    const [project, description, ...tags] = tracking.tags
    const isSameProject = (project === filters.project)

    if (isSameProject) {
      const moment = extendMoment(Moment)
      const trackingRange = moment.range(
        moment(tracking.start), moment(tracking.end)
      )
      const filtersRange = moment.range(
        moment(filters.from), moment(filters.to)
      )

      inInterval = trackingRange.overlaps(filtersRange)
    }
    return isSameProject && inInterval
  }
}
