var express = require('express');
var urlMapper = require("./urlMapper");
var app = express();
var config = require(process.argv[2] || './config.json');

var config_EnableUrlList = 'enable-url-list';
var enableUrlList = true;
var config_UrlListPath = 'url-list-path';
var urlListPath = '/_';
var config_Config = 'config';
if (config.hasOwnProperty(config_Config)) {
    if (config.hasOwnProperty(config_EnableUrlList)) {
        enableUrlList = config[config_EnableUrlList];
    }
    if (config.hasOwnProperty(config_UrlListPath)) {
        urlListPath = config[config_UrlListPath];
        if (urlListPath[0] != '/') {
            urlListPath = '/' + urlListPath;
        }
    }
}

// Add url
app.get('/add', function (req, res) {
    // TODO
    res.send("add");
});
// Delete url
app.get('/del', function (req, res) {
    // TODO
    res.send("del");
});
// List urls
app.get(urlListPath, function (req, res) {
    if (enableUrlList) {
        sendUrls(res);
    }
});
// Route all others to urlMapper
app.get('/*', function (req, res) {
    urlMapper.map(req, res)
});
// Route empty to mapper (for index pages)
app.get('/', function (req, res) {
    urlMapper.map(req, res)
});

// Print out urls
function sendUrls(res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(config.urls, null, 3));
}
app.listen(config.port, config.host, function () {
    // Server running
    console.log('server listening on http://%s:%d', config.host, config.port);
    console.dir(config.urls);
    if (config.gid) process.setgid(config.gid);
    if (config.uid) process.setuid(config.uid);
});