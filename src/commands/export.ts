import { Command, flags } from '@oclif/command'
import { prompt, Question, Separator } from 'inquirer'
import * as moment from 'moment'
import { EOL } from 'os'
import { which } from 'shelljs'

// Our files - FIXME path import
import { FLAGS, FORMATS, PROJECTS } from '../utils/commands/export/constants'
import { DateValidator, FormatValidator, ProjectValidator } from '../utils/commands/export/validators'

export default class Export extends Command {
  static description = 'export data for a specific date / project'

  // FIXME add more examples
  static examples = [
    '$ twe export --interactive'
  ]

  // https://oclif.io/docs/flags
  static flags = FLAGS

  // https://oclif.io/docs/args
  static args = []

  /**
   * Entrypoint of the `twe export` command
   */
  async run() {
    let { flags } = this.parse(Export)
    const availableFlags = this.availableFlags(FLAGS)
    const missingFlags = availableFlags.filter(el => !(el in flags))
    const availableFlagsValues = {
      formats: FORMATS,
      projects: PROJECTS
    }

    // Step 1 - check requirements
    const invalidRequirements = this.checkRequirements()
    if (invalidRequirements.length !== 0) {
      const plural = (invalidRequirements.length > 1) ? 's' : ''
      let errorMessage = `missing requirement${plural} ${EOL}`
      errorMessage += invalidRequirements.map((executable: any) => {
        return `• ${executable.name} is required (command '${executable.cmd}')`
      }).join(EOL)
      this.error(errorMessage, { exit: 2 })
    }

    // Step 2 - check flags values (or exit)
    if (missingFlags.length !== 0) {
      if (flags.interactive) {
        const missingFlagsData = await this.askMissingFlags(
          missingFlags, availableFlagsValues
        )
        flags = { ...flags, ...missingFlagsData }
      } else {
        this.error('Missing parameters', { exit: 3 })
      }
    }

    // Step 2.1 - remove 'interactive' flag
    const { interactive, ...params } = flags

    // Step 3 - Verify params
    const invalidParams = this.checkParams(params, availableFlagsValues)
    if (invalidParams.length !== 0) {
      const plural = (invalidParams.length > 1) ? 's' : ''
      let errorMessage = `invalid param${plural} ${EOL}`
      errorMessage += invalidParams.map((invalidParam: string) => {
        return `• ${invalidParam}`
      }).join(EOL)
      this.error(errorMessage, { exit: 2 })
    }

    // (FIXME) Step 4 - Extract data
    // (FIXME) Step 5 - Filter data
    // (FIXME) Step 6 - Aggregate data
    // (FIXME) Step 7 - Save data
  }

  /**
   * CLI flags of 'export' commands
   */
  private availableFlags(flags: any) {
    return Object.keys(flags).filter((el, _index, _array) => {
      return el !== 'help'
    })
  }

  /**
   * Check that Taskwarrior and Timewarrior are installed
   */
  private checkRequirements(): Array<string> {
    const executables = [
      { name: 'Taskwarrior', cmd: 'task' },
      { name: 'Timewarrior', cmd: 'timew' }
    ]
    return executables.reduce((acc: Array<any>, executable) => {
      const installed = which(executable.cmd)
      return installed ? acc : acc.concat([executable])
    }, [])
  }

  /**
   * Ask user for missing flags
   */
  private async askMissingFlags(
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
          this.error(`You should not be here with ${el}`, { exit: 3 })
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

  /**
   * Check if all params are valid
   */
  private checkParams(params: any, availableFlagsValues: any) {
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
          this.error(`You should not be here with ${key}`, { exit: 3 })
      }
      return valid !== true ? acc.concat([valid]) : acc
    }, [])
  }
}
