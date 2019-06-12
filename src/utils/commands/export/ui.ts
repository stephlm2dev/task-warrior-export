import { prompt, Question } from 'inquirer'
import * as moment from 'moment'

import { DateValidator } from './validators'

export default class ExportUi {
  constructor() {}

  /**
   * Ask user for missing flags
   */
  public async askMissingFlags(
    missingFlags: Array<string>, availableFlagsValues: any
  ) {
    const questions = missingFlags.map(el => {
      let input = null
      switch (el) {
        case 'format':
          input = this.askFormat(availableFlagsValues.formats)
          break
        case 'project':
          input = this.askProject(availableFlagsValues.projects)
          break
        case 'from':
          input = this.askStartDate()
          break
        case 'to':
          input = this.askEndDate()
          break
        default:
          // FIXME handle error case
          // this.error(`You should not be here with ${el}`, { exit: 3 })
      }
      return input
    })

    const answers = await this.askUser(questions)
    return answers
  }

  /**
   * InquirerJS question for output format
   * 'json' or 'csv' are currently supported
   */
  private askFormat(availableFormats: Array<string>): Question {
    const choices = availableFormats.map(format => {
      return { name: format.toUpperCase(), value: format }
    })
    return {
      type: 'list',
      name: 'format',
      message: 'Which output format do you want ?',
      default: choices[0].value,
      choices
    }
  }

  /**
   * InquirerJS question for project
   */
  private askProject(availableProjects: Array<string>): Question {
    return {
      type: 'list',
      name: 'project',
      message: 'Which project ?',
      default: availableProjects[0],
      choices: availableProjects,
      pageSize: availableProjects.length
    }
  }

  /**
   * InquirerJS question for start date export
   * valide ! (use of moment.js)
   */
  private askStartDate(): Question {
    return {
      type: 'input',
      name: 'from',
      message: 'From which date (YYYY-MM-DD) ?',
      default: moment().startOf('month').format('YYYY-MM-DD'),
      validate: new DateValidator().isValid
    }
  }

  /**
   * InquirerJS question for end date export
   */
  private askEndDate(): Question {
    return {
      type: 'input',
      name: 'to',
      message: 'Until which date (YYYY-MM-DD) ?',
      default: moment().endOf('month').format('YYYY-MM-DD'),
      validate: new DateValidator().isValid
    }
  }

  /**
   * Ask user input with Inquirer.js
   *
   * @see https://github.com/SBoudrias/Inquirer.js
   */
  private async askUser(questions: Array<Question>) {
    return prompt(questions)
  }
}
