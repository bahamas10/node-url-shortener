#!/usr/bin/env node
/**
 * Create a simple url-shortener webserver
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * License: MIT
 */

// Modules and constants
var http = require('http'),
    fs = require('fs'),
    config_file = 'config.json';

// Try to load the config file
try {
  var config = JSON.parse(fs.readFileSync(config_file, 'ascii'));
} catch (e) {
  console.error('Config file %s not found! copy from %s.dist', config_file, config_file);
  process.exit(1);
}

// Try to load the URLs file
try {
  var urls = JSON.parse(fs.readFileSync(config.urls, 'ascii'));
} catch (e) {
  console.error('URLs file %s not found! copy from %s', config.urls, 'urls.json.dist');
  process.exit(2);
}

// Create the server
http.createServer(function (req, res) {
  console.log('[%s] request received from %s for %s', Date(), req.connection.remoteAddress, req.url);
  // Grab the request and find the url
  var url_key = req.url.substr(1),
      location = urls[url_key] || null;

  if (location) {
    // Redirect
    res.writeHead(302, {'Location': location});
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
