#!/usr/bin/env node
/**
 * Create a simple url-shortener webserver
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * License: MIT
 */

// Modules and constants
var http = require('http');
var fs = require('fs');
var config_file = './config.json';

// Try to load the config file
try {
  var config = require(config_file);
} catch (e) {
  console.error('Error: file %s not found or unreadable! copy from %s.dist',
      config_file, config_file);
  process.exit(1);
}

// Try to load the URLs file
try {
  var urls = require(config.urls);
} catch (e) {
  console.error('Error: URLs file %s not found or unreadable! copy from %s',
      config.urls, 'urls.json.dist');
  process.exit(2);
}

// Create the server
http.createServer(function (req, res) {
  // Decorate
  req.received_date = new Date();

  // log when a response is a set (to get code and everything)
  var res_end = res.end;
  res.end = function() {
    var delta = new Date() - req.received_date;
    console.log('[%s] %s %s %s %s (%dms)',
        new Date().toJSON(), req.connection.remoteAddress, req.method,
        res.statusCode, req.url, delta);

    // Now call the original
    res_end.apply(res, arguments);
  };

  // Grab the request and find the url
  var url_key = req.url.substr(1);
  var location = urls[url_key] || null;

  if (location) {
    // Redirect
    res.writeHead(301, {Location: location});
  } else {
    // Not found
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(urls));
  }
  res.end();
}).listen(config.port, config.host, function() {
  // Server running
  console.log('Server listening on %s:%d', config.host, config.port);
  console.dir(urls);
  if (config.gid) process.setgid(config.gid);
  if (config.uid) process.setuid(config.uid);
});
