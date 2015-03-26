var express = require('express');
var app = express();
var config = require(process.argv[2] || './config.json');


app.get('/', function(req, res) {
    console.log(req.hostname);
    res.redirect('http://google.com');
});

var server = app.listen(config.port, config.host, function() {
    var host = server.address().address;
    var port = server.address().port;
    // Server running
    console.log('server listening on http://%s:%d', config.host, config.port);
    console.dir(config.domains);
    if (config.gid) process.setgid(config.gid);
    if (config.uid) process.setuid(config.uid);
});