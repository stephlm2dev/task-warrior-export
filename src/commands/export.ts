import {Command, flags} from '@oclif/command'

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
    let {flags} = this.parse(Export)
    const availableFlags = this.availableFlags()
    const missingFlags = availableFlags.filter(el => !(el in flags))

    // Step 1 - check flags values (or exit)
    if (missingFlags.length !== 0) {
      if (flags.interactive) {
        const missingFlagsData = this.askMissingFlags(missingFlags)
        flags = { ...flags, ...missingFlagsData }
      } else {
        this.error('Missing parameters', {exit: 2})
      }
    }

    // (FIXME) Step 2 - Verify
    // (FIXME) Step 3 - Extract data
    // (FIXME) Step 4 - Filter data
    // (FIXME) Step 5 - Aggregate data
    // (FIXME) Step 6 - Save data
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
   * Ask user for missing flags
   */
  private askMissingFlags(missingFlags: Array<string>) {
    return missingFlags.reduce((accumulator, el) => {
      let input = null
      switch (el) {
        case 'format':
          input = { format: this.askFormat() }
          break
        case 'project':
          input = { project: this.askProject() }
          break
        case 'from':
          input = { from: this.askStartDate() }
          break
        case 'to':
          input = { to: this.askEndDate() }
          break
        default:
          this.error(`You should not be here with ${el}`, {exit: 3})
      }
      return { ...accumulator, ...input }
    }, {})
  }

  /**
   * FIXME
   */
  private askFormat() {
    return 'json'
  }

  /**
   * FIXME
   */
  private askProject() {
    return '#project'
  }

  /**
   * FIXME
   */
  private askStartDate() {
    return '2019-05-01'
  }

  /**
   * FIXME
   */
  private askEndDate() {
    return '2019-06-01'
  }

}
