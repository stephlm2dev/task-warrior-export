import { flags } from '@oclif/command'
import { EOL } from 'os'
import { exec } from 'shelljs'

class Constants {
  private _flags: any
  private _formats: Array<string>
  private _projects: Array<string>

  constructor() {
    this._flags = this.setFlags()
    this._formats = this.setFormats()
    this._projects = this.setProjects()
  }

  get flags() {
    return this._flags
  }

  get formats() {
    return this._formats
  }

  get projects() {
    return this._projects
  }

  private setFlags() {
    return {
      // -h, --help
      help: flags.help({
        char: 'h',
        description: 'display help',
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
        default: false,
        required: false
      })
    }
  }

  /**
   * List all available exports format
   */
  private setFormats() {
    return ['csv', 'json']
  }

  /**
   * List all projects from Taskwarrior
   */
  private setProjects() {
    const command = 'task rc.list.all.projects=1 _projects'
    const { stdout, stderr, code } = exec(command, { silent: true })
    /* FIXME handle error case
      if (code !== 0) {
        this.error(stderr.trim(), { exit: code })
      }
     */
    return stdout.trim().split(EOL)
  }
}

const constants = new Constants()
const FLAGS = constants.flags
const FORMATS = constants.formats
const PROJECTS = constants.projects

export {
  FLAGS,
  FORMATS,
  PROJECTS
}
