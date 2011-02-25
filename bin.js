#!/usr/bin/env node
var Knid = require('./knid.js').Knid
  , argv = require('optimist')
    .usage(["knid p http://example.com/ comment can span multiple arguments"
          , "  creates a configuration file in ~/.knid"
          , "knid config"
          , "  creates a configuration file in ~/.knid"
          , "knid ddoc"
          , "  creates or updates the ddoc"].join("\n"))
    .demand(1)
    .check(function (argv) {
      var command = argv._[0]
      if (['p', 'config', 'ddoc'].indexOf(command) < 0) {
        throw 'invalid command: ' + argv._[0]
      }
      if (command === 'p') {
        if (argv._.length < 3) throw 'p takes 2+ arguments'
      } else if (command === 'config') {
        if (argv._.length != 1) throw 'config takes no arguments'
      } else if (command === 'ddoc') {
        if (argv._.length != 1) throw 'ddoc takes no arguments'
      }
    })
    .argv
  , command = argv._[0]
  , Seq = require('seq')

var knid = new Knid()
if (command === 'config') {
  knid.writeConfig()
} else {
  knid.loadConfig(function() {
    if (command === 'post') {
      knid.post(argv._.slice(1))
    } else if (command === 'ddoc') {
      knid.ddoc()
    }
  })
}

