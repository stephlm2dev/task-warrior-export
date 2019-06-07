import { Command, flags } from '@oclif/command'
import { prompt, Question, Separator } from 'inquirer'
import * as moment from 'moment'
import { EOL } from 'os'
import { exec, which } from 'shelljs'

export default class Export extends Command {
  static description = 'export data for a specific date / project'

  // FIXME add more examples
  static examples = [
    '$ twe export --interactive'
  ]

  // https://oclif.io/docs/flags
  static flags = {
    // -h, --help
    help: flags.help({
      char: 'h',
      description: 'display help',
      multiple: false,
      required: false
    }),
    format: flags.string({
      char: 'f',
      description: 'output format (ie "json" or "csv")',
      multiple: false,
      required: false
    }),
    project: flags.string({
      char: 'p',
      description: 'name of the project',
      multiple: false,
      required: false
    }),
    from: flags.string({
      char: 'f',
      description: 'start date with format "YYYY-MM-DD"',
      multiple: false,
      required: false
    }),
    to: flags.string({
      char: 't',
      description: 'end date with format "YYYY-MM-DD"',
      multiple: false,
      required: false
    }),
    interactive: flags.boolean({
      char: 'i',
      description: 'interactive mode',
      multiple: false,
      default: false,
      required: false
    })
  }

  // https://oclif.io/docs/args
  static args = []

  /**
   * Entrypoint of the `twe export` command
   */
  async run() {
    let { flags } = this.parse(Export)
    const availableFlags = this.availableFlags()
    const missingFlags = availableFlags.filter(el => !(el in flags))
    const availableProjects = this.availableProjects()

    // Step 1 - check requirements
    const invalidRequirements = this.checkRequirements()
    if (invalidRequirements.length !== 0) {
      const plural = (invalidRequirements.length > 1) ? 's' : ''
      let errorMessage = `missing requirement${plural} EOL`
      errorMessage += invalidRequirements.map(executable => {
        return `• ${executable.name} is required (command '${executable.cmd}')`
      }).join(EOL)
      this.error(errorMessage, { exit: 2 })
    }

    // Step 2 - check flags values (or exit)
    if (missingFlags.length !== 0) {
      if (flags.interactive) {
        const missingFlagsData = await this.askMissingFlags(
          missingFlags, availableProjects
        )
        flags = { ...flags, ...missingFlagsData }
      } else {
        this.error('Missing parameters', { exit: 3 })
      }
    }

    // Step 3 - Verify params
    const validParams = this.checkFlags(flags, availableProjects)
    if (validParams !== true) {
      this.error(validRequirements, { exit: 4 })
    }

    // (FIXME) Step 4 - Extract data
    // (FIXME) Step 5 - Filter data
    // (FIXME) Step 6 - Aggregate data
    // (FIXME) Step 7 - Save data
  }

  /**
   * CLI flags of 'export' commands
   */
  private availableFlags() {
    return Object.keys(Export.flags).filter((el, _index, _array) => {
      return el !== 'help'
    })
  }

  /**
   * List all projects from Taskwarrior
   */
  private availableProjects() {
    const command = 'task rc.list.all.projects=1 _projects'
    const { stdout, stderr, code } = exec(command, { silent: true })
    return stdout.trim().split(EOL)
  }

  /**
   * Check that Taskwarrior and Timewarrior are installed
   */
  private checkRequirements(): Array<string> {
    const executables = [
      { name: 'Taskwarrior', cmd: 'task' },
      { name: 'Timewarrior', cmd: 'timew' }
    ]
    return executables.reduce((acc, executable) => {
      const installed = which(executable.cmd)
      return installed ? acc : acc.concat([executable])
    }, [])
  }

  /**
   * Ask user for missing flags
   */
  private async askMissingFlags(
    missingFlags: Array<string>, availableProjects: Array<string>
  ) {
    const questions = missingFlags.map(el => {
      let input = null
      switch (el) {
        case 'format':
          input = this.askFormat()
          break
        case 'project':
          input = this.askProject(availableProjects)
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
    }, {})

    const answers = await this.askUser(questions)
    return answers
  }

  /**
   * InquirerJS question for output format
   * 'json' or 'csv' are currently supported
   */
  private askFormat(availableFormats: Array<string>): Question {
    const choices = [
      { name: 'CSV', value: 'csv' },
      { name: 'JSON', value: 'json' }
    ]
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
      validate: this.validateDateFormat
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
      validate: this.validateDateFormat
    }
  }

  /**
   * Validation for input date
   * Must be a valid date
   * If 'from' is present, check if 'to' after 'from'
   */
  private validateDateFormat(date: string, answers: any) {
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
  private checkFlags(flags, availableProjects: Array<string>) {
    // map or every ?
    return true
  }
}
