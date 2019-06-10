import { Validator } from './validator'

/**
 * Validation for format
 * 'json' or 'csv' are currently supported
 */
export default class FormatValidator implements Validator {
  public isValid(format: string, availableFormats: Array<string>) {
    let valid: boolean | string = availableFormats.some(availableFormat => {
      return format === availableFormat
    })
    if (!valid) {
      valid = `Unknow format '${format}' (csv and json are currently supported)`
    }
    return valid
  }
}
