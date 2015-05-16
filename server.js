#!/usr/bin/env node
/**
 * Create a simple url-shortener webserver
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * License: MIT
 * Created: 6/5/2012
 */

var fs = require('fs');
var http = require('http');
var path = require('path');

var accesslog = require('access-log');
var easyreq = require('easyreq');

var configfile = process.argv[2] || path.join(__dirname, 'config.json');
var config = JSON.parse(fs.readFileSync(configfile, 'utf8'));

// Create the server
http.createServer(function (req, res) {
  easyreq(req, res);
  accesslog(req, res);

  var key = req.url.slice(1);
  if (req.url === '/') {
    // index
    res.json(config.urls, 200, true);
  } else if (config.urls.hasOwnProperty(key)) {
    // redirect
    res.redirect(config.urls[key]);
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
