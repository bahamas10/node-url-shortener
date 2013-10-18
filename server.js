#!/usr/bin/env node
/**
 * Create a simple url-shortener webserver
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * License: MIT
 * Created: 6/5/2012
 */

var http = require('http');

var accesslog = require('access-log');
var easyreq = require('easyreq');

var config = require(process.argv[2] || './config.json');

// Create the server
http.createServer(function (req, res) {
  easyreq(req, res);
  accesslog(req, res);

  // Grab the request and find the url
  var urlkey = req.url.substr(1);
  var location = config.urls[urlkey];

  if (req.url === '/') {
    // index
    res.json(config.urls);
  } else if (location) {
    // redirect
    res.redirect(location);
  } else {
    // not found
    res.notfound();
  }
}).listen(config.port, config.host, function() {
  // Server running
  console.log('server listening on http://%s:%d', config.host, config.port);
  console.dir(config.urls);
  if (config.gid) process.setgid(config.gid);
  if (config.uid) process.setuid(config.uid);
});
