import { Command } from '@oclif/command'
import { EOL } from 'os'

// Our files - FIXME path import
import {
  FLAGS, FORMATS, PROJECTS, TIMETRACKING
} from '../utils/commands/export/constants'
import ExportUi from '../utils/commands/export/ui'
import ExportUtils from '../utils/commands/export/utils'
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
    const tools = {
      utils: new ExportUtils(),
      validator: new ExportValidator()
    }

    // Step 1 - check requirements
    this.checkRequirements(tools)

    // Step 2 - Prepare parsing
    let {
      flags, availableFlags, missingFlags, availableFlagsValues
    } = this.prepareCommandParsing(tools)

    // Step 3 - check flags values (or exit)
    if (missingFlags.length !== 0) {
      const missingFlagsData = await this.askMissingFlags(
        flags.interactive, missingFlags, availableFlagsValues
      )
      flags = { ...flags, ...missingFlagsData }
    }

    // Step 3 - Verify params
    const { interactive, ...params } = flags
    this.checkParams(tools, params, availableFlagsValues)

    // Step 4 - Filter data
    const filteredData = tools.utils.filterData(tools, params, TIMETRACKING)

    // Step 5 - Aggregate data
    const aggregatedData = tools.utils.aggregateData(tools, filteredData)

    // Step 6 - Save data
    await tools.utils.saveFile(filteredData, params, 'raw')
    await tools.utils.saveFile(aggregatedData, params, 'aggregated')
  }

  /**
   * Check system requirements
   */
  private checkRequirements(tools: any) {
    // Step 1 - check requirements
    const invalidRequirements = tools.validator.checkRequirements()
    if (invalidRequirements.length !== 0) {
      this.error(
        tools.utils.errorMessage('missing requirement', invalidRequirements),
        { exit: 2 }
      )
    }
    return true
  }

  /**
   * Prepare some stuff
   */
  private prepareCommandParsing(tools: any) {
    // Prepare information
    const { flags } = this.parse(Export)
    const availableFlags = tools.utils.availableFlags(FLAGS)
    const missingFlags = availableFlags.filter(el => !(el in flags))
    const availableFlagsValues = { formats: FORMATS, projects: PROJECTS }
    return { flags, availableFlags, missingFlags, availableFlagsValues }
  }

  /**
   * Ask for missing flags when interactive mode
   */
  private async askMissingFlags(
    interactive: boolean, missingFlags: Array<string>, availableFlagsValues: any
  ) {
    if (!interactive) {
      this.error('Missing parameters', { exit: 3 })
    }
    const missingFlagsData = await new ExportUi().askMissingFlags(
      missingFlags, availableFlagsValues
    )
    return missingFlagsData
  }

  /**
   * Check validity of every params
   */
  private checkParams(tools: any, params: any, availableFlagsValues: any) {
    const invalidParams = tools.validator.checkParams(
      params, availableFlagsValues
    )
    if (invalidParams.length !== 0) {
      this.error(
        tools.utils.errorMessage('invalid param', invalidParams),
        { exit: 2 }
      )
    }
    return true
  }
}
