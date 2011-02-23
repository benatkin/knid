# Synopsis

    ./knid --db http://user:password@localhost:5984/knid p http://cloudhead.io/cradle A nifty CouchDB library for Node.js

All documents contain a `knid` attribute. A design doc will be checked for & created & updated at `_design/knid`.

Info will be posted to a stream at [http://localhost:5984/knid/\_design/knid/\_rewrite/](http://localhost:5984/knid/_design/knid_rewrite/).
The above example will appear as a link.

# TODO

* Implement interface described above.
* Store db address in `~/.knid/config.json` so `--db` isn't required.
* Add setup instructions
* Implement posting plain text from stdin, ala [bcat](http://rtomayko.github.com/bcat/)
* Implement pagination
* Implement daily archive

