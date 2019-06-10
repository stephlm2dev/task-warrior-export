import { which } from 'shelljs'

import { Validator } from './validator'

/**
 * Check that a command is installed
 */
export default class SystemRequirementValidator implements Validator {
  public isValid(executable: any) {
    let valid: boolean | string = which(executable.cmd)
    if (!valid) {
      valid = `${executable.name} is not installed `
      valid += `(command '${executable.cmd}')`
    }
    return valid
  }
}
