#!/usr/bin/env node
var Knid = require('./knid.js').Knid
  , argv = require('optimist')
           .usage(["knid post http://example.com/ comment can span multiple arguments"
                 , "  posts a link"
                 , "knid config"
                 , "  creates a configuration file in ~/.knid"
                 , "knid ddoc"
                 , "  creates or updates the ddoc"].join("\n"))
           .demand(1)
           .check(function (argv) {
             var command = argv._[0]
               , args    = argv._.slice(1)
             if (['post', 'config', 'ddoc'].indexOf(command) < 0)
               throw 'invalid command: ' + command
             if (command === 'config')
               if (argv._.length != 1) throw command + ' takes 0 arguments'
             else if (command === 'ddoc')
               if (argv._.length != 1) throw 'ddoc takes no arguments'
           })
           .argv
  , command = argv._[0]
  , args    = argv._.slice(1)

var knid = new Knid()
if (command === 'config') {
  knid.writeConfig()
} else {
  knid.loadConfig(function() {
    if (command === 'post') {
      knid.post(args, argv)
    } else if (command === 'ddoc') {
      knid.ddoc()
    }
  })
}

