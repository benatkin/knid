#!/usr/bin/env node
var Knid = require('./knid.js').Knid
  , argv = require('optimist')
    .usage("Usage: knid --db http://user:password@localhost:5984/knid \\\n"
         + "p http://cloudhead.io/cradle A nifty CouchDB library for Node.js")
    .demand(['db'])
    .demand(3)
    .argv

if (argv._[0] != 'p') {
  console.log('invalid commnad: ' + argv._[0])
  process.exit()
}

new Knid(argv).post(argv._.slice(1))

