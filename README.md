task-warrior-export
===================

Export {task/time}warrior data per month/per project

[![Version](https://img.shields.io/npm/v/task-warrior-export.svg)](https://npmjs.org/package/task-warrior-export)
[![CircleCI](https://circleci.com/gh/stephlm2dev/task-warrior-export/tree/master.svg?style=shield)](https://circleci.com/gh/stephlm2dev/task-warrior-export/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/stephlm2dev/task-warrior-export?branch=master&svg=true)](https://ci.appveyor.com/project/stephlm2dev/task-warrior-export/branch/master)
[![Codecov](https://codecov.io/gh/stephlm2dev/task-warrior-export/branch/master/graph/badge.svg)](https://codecov.io/gh/stephlm2dev/task-warrior-export)
[![Downloads/week](https://img.shields.io/npm/dw/task-warrior-export.svg)](https://npmjs.org/package/task-warrior-export)
[![License](https://img.shields.io/npm/l/task-warrior-export.svg)](https://github.com/stephlm2dev/task-warrior-export/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g task-warrior-export
$ twe COMMAND
running command...
$ twe (-v|--version|version)
task-warrior-export/0.0.0 darwin-x64 node-v10.15.1
$ twe --help [COMMAND]
USAGE
  $ twe COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`twe hello [FILE]`](#twe-hello-file)
* [`twe help [COMMAND]`](#twe-help-command)

## `twe hello [FILE]`

export data for a specific date / project

```
USAGE
  $ twe export

OPTIONS
  -f, --format=format    output format (ie "json" or "csv")
  -f, --from=from        start date with format "YYYY-MM-DD"
  -h, --help             display help
  -i, --interactive      interactive mode
  -p, --project=project  name of the project
  -t, --to=to            end date with format "YYYY-MM-DD"

EXAMPLES
  $ twe export --interactive

  $ twe export --format=json --interactive

  $ twe export --format=csv --project=name --from=2019-12-01 --to=2019-12-15
```

_See code: [src/commands/export.ts](https://github.com/stephlm2dev/task-warrior-export/blob/v0.0.0/src/commands/export.ts)_

## `twe help [COMMAND]`

display help for twe

```
USAGE
  $ twe help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v1.2.11/src/commands/help.ts)_
<!-- commandsstop -->
