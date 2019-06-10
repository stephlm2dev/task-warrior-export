import { Command } from '@oclif/command'
import { EOL } from 'os'

// Our files - FIXME path import
import { FLAGS, FORMATS, PROJECTS } from '../utils/commands/export/constants'
import ExportUi from '../utils/commands/export/ui'
import ExportValidator from '../utils/commands/export/validators'

export default class Export extends Command {
  static description = 'export data for a specific date / project'

  static examples = [
    '$ twe export --interactive',
    '$ twe export --format=json --interactive',
    '$ twe export --format=csv --project=name --from=2019-12-01 --to=2019-12-15'
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
    const validator = new ExportValidator()

    // Step 1 - check requirements
    const invalidRequirements = validator.checkRequirements()
    if (invalidRequirements.length !== 0) {
      const plural = (invalidRequirements.length > 1) ? 's' : ''
      let errorMessage = `missing requirement${plural} ${EOL}`
      errorMessage += invalidRequirements.map((error: any) => {
        return `• ${error}`
      }).join(EOL)
      this.error(errorMessage, { exit: 2 })
    }

    // Step 2 - check flags values (or exit)
    if (missingFlags.length !== 0) {
      if (flags.interactive) {
        const missingFlagsData = await new ExportUi().askMissingFlags(
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
    const invalidParams = validator.checkParams(params, availableFlagsValues)
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
}
