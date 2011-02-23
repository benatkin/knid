#!/usr/bin/env node
var Knid = require('./knid.js').Knid
  , argv = require('optimist')
    .usage("Usage: knid --db http://user:password@localhost:5984/knid \\\n"
         + "p http://cloudhead.io/cradle A nifty CouchDB library for Node.js\n")
    .demand(['db'])
    .demand(3)
    .check(function (argv) {
        if (['p'].indexOf(argv._[0]) < 0) {
            throw 'invalid command: ' + argv._[0];
        }
    })
    .argv

new Knid(argv).post(argv._.slice(1))

