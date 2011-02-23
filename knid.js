var cradle = require('cradle')
  , Seq = require('seq')
  , fs = require('fs')
  , path = require('path')
  , url = require('url')

var Knid = exports.Knid = function() {
  this.configDir = path.join(process.env.HOME, '.knid')
  this.configFile = path.join(this.configDir, 'config.json')
}

Knid.prototype = {
  defaultConfig: {
    db: 'http://localhost:5984/knid'
  },
  post: function(parg) {
    console.log('ran post - not yet implemented')
    console.log('url: ' + parg[0])
    console.log('text: ' + parg.slice(1).join(' '))
  },
  writeConfig: function() {
    var that = this
    Seq()
    .seq(function() {
      fs.mkdir(that.configDir, 0777, this)
    })
    .seq(function() {
      fs.writeFile(that.configFile, JSON.stringify(that.defaultConfig, null, 2), this)
    })
    .seq(function(err) {
      console.log('Config created in ~/.knid/config.json')
    })
  },
  loadConfig: function(cb) {
    var that = this
    Seq()
    .seq(function() {
      fs.readFile(that.configFile, this)
    })
    .seq(function(data) {
      that.config = JSON.parse(data)
      var dburl = url.parse(that.config.db)
        , opts = {}
        , port = 80
      if (dburl.protocol === 'https:') {
        opts.secure = true
        port = 443
      }
      if (typeof dburl.auth === 'string' && dburl.auth.indexOf(':') !== -1) {
        opts.auth = {username: dburl.auth.split(':')[0], password: dburl.auth.split(':')[1]}
      }
      if (typeof dburl.port !== 'undefined') port = parseInt(dburl.port)
      that.conn = new cradle.Connection(dburl.hostname, port, opts)
      if (! (typeof dburl.pathname === 'string' && dburl.pathname.split('/').length == 2))
        throw 'invalid db url: ' + that.config.db
      var dbname = dburl.pathname
      that.db = that.conn.database(dbname)
      that.db.exists(this)
    })
    .seq(function(exists) {
      if (exists === false)
        that.db.create(this)
      else
        this()
    })
    .seq(function() {
      cb()
    })
    .catch(function(err) {
      console.log('Error accessing database. Please check the permissions.')
      throw err
    })
  },
  ddoc: function() {
    this.db.save('_design/knid', {
      views: {
        recent: {
          map: function(doc) {
            if (doc.knid) {
              emit(doc.date, doc)
            }
          }
        }
      }
    })
  }
}
