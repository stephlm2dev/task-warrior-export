import {Command, flags} from '@oclif/command'

export default class Hello extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ twe hello
hello world from ./src/hello.ts!
`,
  ]

  // https://oclif.io/docs/flags
  static flags = {
    help: flags.help({
      char: 'h'
    }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({
      char: 'n',
      description: 'name to print',
      multiple: false,
      default: 'world',
      required: false,

    }),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  // https://oclif.io/docs/args
  static args = [{
    name: 'file',
    required: true,
    description: 'output file',
    default: 'world'
  }]

  async run() {
    const {args, flags} = this.parse(Hello)

    const name = flags.name || 'world'
    this.log(`hello ${name} from ./src/commands/hello.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
    // show a warning
    this.warn('uh oh!')
    // exit with an error message
    this.error('uh oh!!!', {exit: 2})
    // exit with status code
    this.exit(1)
  }
}
