var express = require('express');
var config = require(process.argv[2] || './config.json');

var urlMapper = require("./urlMapper");

var app = express();
app.get('/add', function(req, res) {
    // Add url
    res.send("add");
});

app.get('/del', function(req, res) {
    // Delete url
    res.send("del");
});

app.get('/urllist', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(config.urls, null, 3));
});

app.get('/*', function(req, res) {
    console.log(req.hostname);
    console.log(req.params[0]);
    // Map the url
    if(!urlMapper.map(req, res)){
        console.log('ERROR, can\'t find match for ' + req.hostname + '/' + req.params[0]);
    }
});



app.listen(config.port, config.host, function() {
    // Server running
    console.log('server listening on http://%s:%d', config.host, config.port);
    console.dir(config.domains);
    if (config.gid) process.setgid(config.gid);
    if (config.uid) process.setuid(config.uid);
});