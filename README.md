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

# Current Status and Demo

Right now only posting links, with text is supported. No date is shown but it's sorted by date.

I have a demo at [stream.benatkin.com](http://stream.benatkin.com/). Public create permissions are on, so if you do the following you might be able to post to it:

1. run `npm install knid`
2. run `knid config`
3. open `~/.knid/config.json` and replace `http://localhost:5984/` with `http://bat.cloudant.com/knid`
4. run `knid p http://example.com/ a comment`

# TODO

* Add error handling for `knid ddoc`
* Implement posting plain text from stdin, ala [bcat](http://rtomayko.github.com/bcat/)
* Add setup instructions
* Implement pagination
* Implement daily archive

