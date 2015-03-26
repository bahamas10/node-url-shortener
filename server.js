#!/usr/bin/env node
/**
 * Create a simple url-shortener webserver
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * License: MIT
 * Created: 6/5/2012
 */

var accesslog = require('access-log');
var easyreq = require('easyreq');
var http = require('http');
var config = require(process.argv[2] || './config.json');

// Create the server
http.createServer(function (req, res) {
    easyreq(req, res);
    accesslog(req, res);
    console.log("Host: " + req.host);
    console.log("Hostname: " + req.hostname);
    var key = req.url.slice(1).split('/');
    var reqDomain = key[0];
    var reqKey = key.join('/').substr(reqDomain.length + 1).replace(/(\/$|\/\/$|\/\/\/$)/, '');
    /*
    console.log('key=' + key + '=');
    console.log('reqDomain=' + reqDomain + '=');
    console.log('reqUrl=' + reqKey + '=');
    */
    if (req.url === '/') {
        res.setHeader('Content-Type', 'application/json');
        // Prettier than res.json() when using sub-objects.
        res.end(JSON.stringify(config.domains, null, 3));
    }
    // Check for domain
    else if (config.domains.hasOwnProperty(reqDomain)) {
        if (!reqKey) { // No key? Default to index
            reqKey = 'index';
        }

        // Check for subsite page key
        if (config.domains[reqDomain].hasOwnProperty(reqKey)) {
            var target = config.domains[reqDomain][reqKey];
            // see if target is an alias
            if ((/^alias:/).test(target)) {
                var aliasKey = target.replace(/^alias:/, '');
                console.log('aliasKey=' + aliasKey);
                if (config.domains[reqDomain].hasOwnProperty(aliasKey)) {
                    target = config.domains[reqDomain][aliasKey];
                    // Redirect alias
                    res.redirect(target);
                }
                else {
                    // Alias has no valid target
                    res.end('ERROR: NO PAGE FROM ALIAS NAMED =' + reqKey + '= IN DOMAIN =' + reqDomain + '=', 404);
                }
            }
            else {
                // Redirect valid non-alias
                res.redirect(target);
            }
        }
        else {
            // Print out some info to help debug with end users.
            res.end('ERROR: NO PAGE NAMED =' + reqKey + '= IN DOMAIN =' + reqDomain + '=', 404);
        }
    }
    else {
        // Print out some info to help debug with end users.
        res.end('ERROR: NO SUCH DOMAIN =' + reqDomain + '=', 404);
    }
}).listen(config.port, config.host, function () {
    // Server running
    console.log('server listening on http://%s:%d', config.host, config.port);
    console.dir(config.domains);
    if (config.gid) process.setgid(config.gid);
    if (config.uid) process.setuid(config.uid);
});
