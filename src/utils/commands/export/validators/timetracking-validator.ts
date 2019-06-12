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
    // FIXME
    return valid || `Unknown project '${project}'`
  }
}
