var express = require('express');
var urlMapper = require("./urlMapper");
var app = express();
var config = require(process.argv[2] || './config.json');

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
app.get('/urllist', function (req, res) {
    sendUrls(res);
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