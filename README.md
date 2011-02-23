# Synopsis

    > knid config
    Config created in ~/.knid/config.json
    Please update with your database credentials.
    Then run `knid ddoc`.
    > knid ddoc
    Design doc created at http://localhost:5984/knid/_design/knid
    > knid p http://cloudhead.io/cradle A nifty CouchDB library for Node.js
    Link posted to http://localhost:5984/knid/_design/knid/_rewrite/
    > 

A design doc will be checked for & created & updated at `_design/knid`.

Info will be posted to a stream at [http://localhost:5984/knid/\_design/knid/\_rewrite/](http://localhost:5984/knid/_design/knid_rewrite/).
The above example will appear as a link.

# TODO

* Add setup instructions
* Implement posting plain text from stdin, ala [bcat](http://rtomayko.github.com/bcat/)
* Implement pagination
* Implement daily archive

