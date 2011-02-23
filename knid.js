var Knid = exports.Knid = function(db) {
  this.db = db;
}

Knid.prototype.post = function(parg) {
  console.log('ran post - not yet implemented');
  console.log('url: ' + parg[0]);
  console.log('text: ' + parg.slice(1).join(' '));
};
