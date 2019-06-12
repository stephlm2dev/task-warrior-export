import DateValidator from './validators/date-validator'
import FormatValidator from './validators/format-validator'
import ProjectValidator from './validators/project-validator'
import SystemRequirementValidator from './validators/system-requirement-validator'

export default class ExportValidator {
  private executables = [
    { name: 'Taskwarrior', cmd: 'task' },
    { name: 'Timewarrior', cmd: 'timew' }
  ]

  /**
   * Check that Taskwarrior and Timewarrior are installed
   */
  public checkRequirements(): Array<string> {
    return this.executables.reduce((acc: Array<any>, executable) => {
      const installed = new SystemRequirementValidator().isValid(executable)
      return installed === true ? acc : acc.concat([installed])
    }, [])
  }

  /**
   * Check if all params are valid
   */
  public checkParams(params: any, availableFlagsValues: any) {
    return Object.keys(params).reduce((acc: Array<any>, key) => {
      const value = params[key]
      let valid: boolean | string = true
      switch (key) {
        case 'format':
          valid = new FormatValidator().isValid(value, availableFlagsValues.formats)
          break
        case 'project':
          valid = new ProjectValidator().isValid(value, availableFlagsValues.projects)
          break
        case 'from':
          valid = new DateValidator().isValid(value, {})
          break
        case 'to':
          valid = new DateValidator().isValid(value, params)
          break
        default:
          valid = `You should not be here with ${key}`
      }
      return valid !== true ? acc.concat([valid]) : acc
    }, [])
  }
}

export {
  DateValidator,
  FormatValidator,
  ProjectValidator,
  SystemRequirementValidator
}
