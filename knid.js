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
    var that = this
    Seq()
    .seq(function() {
      that.db.save({
        url: parg[0],
        text: parg.slice(1).join(' '),
        created_at: new Date()
      }, this)
    })
    .seq(function() {
      console.log('saved!')
    })
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
            if (doc.created_at) {
              emit(doc.created_at, doc)
            }
          }
        }
      },
      lists: {
        'recent-stream': function(head, req) {
          /*
           flatstache.js - Logic-less, section-less templates in JavaScript. Expands simple (flat) Mustache templates.
           (c) 2011 Nathan Vander Wilt and Aaron McCall. MIT license.
          */
          var Flatstache = (function(){
              var _re3 = /{{{\s*(\w+)\s*}}}/g,
                  _re2 = /{{\s*(\w+)\s*}}/g,
                  _re1 = /[&\"'<>\\]/g,  // "
                  _escape_map = {"&": "&amp;", "\\": "&#92;", "\"": "&quot;", "'": "&#39;", "<": "&lt;", ">": "&gt;"},
                  _escapeHTML = function(s) {
                      return s.replace(_re1, function(c) { return _escape_map[c]; });
                  },
                  pub = {};
              pub.to_html = function (template, data) {
                  return template
                      .replace(_re3, function (m, key) { return data[key] || ""; })
                      .replace(_re2, function (m, key) { return _escapeHTML(data[key] || ""); });
              };
              return pub;
          })();
        
          var ddoc = this;

          provides('html', function() {
            posts = []
            while (row = getRow()) {
              posts.push(Flatstache.to_html(ddoc.templates.link, row.value));
            }
            send(Flatstache.to_html(ddoc.templates.page, {posts: posts.join("\n")}))
          })
        }
      },
      rewrites: [
        {
          from: '',
          to: '_list/recent-stream/recent',
          method: 'GET',
          query: {}
        }
      ],
      templates: {
        page: ["<!DOCTYPE html>"
             , "<html lang=\"en\">"
             , "<head>"
             , "  <meta charset=\"utf-8\" />"
             , "  <title>knid stream</title>"
             , "</head>"
             , "<body id=\"home\">"
             , "  <h1>knid stream</h1>"
             , "  {{{ posts }}}"
             , "</body>"
             , "</html>\n"].join("\n"),
        link: ["<div class=\"link\">"
             , "  <a href=\"{{ url }}\">{{ text }}</a>"
             , "</div>"].join("\n")
      }
    })
  }
}
