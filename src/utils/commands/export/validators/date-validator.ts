import * as moment from 'moment'

import { Validator } from './validator'

/**
 * Validation for input date
 * Must be a valid date
 * If 'from' is present, check if 'to' after 'from'
 */
export default class DateValidator implements Validator {
  public isValid(date: string, answers: any) {
    const momentDate = moment(date, 'YYYY-MM-DD', true)
    if (!momentDate.isValid()) {
      return 'Invalid date (YYYY-MM-DD)'
    }
    if ('from' in answers) {
      const momentFrom = moment(answers.from)
      return momentDate.isAfter(momentFrom) || 'Date is not in the future'
    }
    return true
  }
}
