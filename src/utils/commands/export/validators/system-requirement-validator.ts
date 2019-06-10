import { which } from 'shelljs'

import { Validator } from './validator'

/**
 * Check that a command is installed
 */
export default class SystemRequirementValidator implements Validator {
  public isValid(executable: any) {
    const path = which(executable.cmd)
    let valid: boolean | string = (path !== null)
    if (!valid) {
      valid = `${executable.name} is not installed `
      valid += `(command '${executable.cmd}')`
    }
    return valid
  }
}
