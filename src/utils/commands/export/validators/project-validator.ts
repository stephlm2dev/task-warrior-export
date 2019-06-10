import { Validator } from './validator'

/**
 * Validation for project
 */
export default class ProjectValidator implements Validator {
  public isValid(project: string, availableProjects: Array<string>) {
    let valid: boolean | string = availableProjects.some(availableProject => {
      return project === availableProject
    })
    return valid || `Unknown project '${project}'`
  }
}
