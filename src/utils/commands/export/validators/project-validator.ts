import { Validator } from './validator'

/**
 * Validation for project
 */
export default class ProjectValidator implements Validator {
  public isValid(project: string, availableProjects: Array<string>) {
    let valid: boolean | any = availableProjects.some(availableProject => {
      return project === availableProject
    })
    if (!valid) {
      valid = `Unknown project '${project}'`
    }
    return valid
  }
}
