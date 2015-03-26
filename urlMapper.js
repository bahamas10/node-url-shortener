var config = require(process.argv[2] || './config.json');

exports.map = function (req, res) {
    var matchFound = false;

    // Get the requested url without any forward slashes at the end.
    var key = req.params[0].replace(/(\/$|\/\/$|\/\/\/$)/, '');
    var host = req.hostname;
    if(keyExists(host, key)) {

    }

    return matchFound;
};

// Check hostname exists
function hostExists(host) {
    var found = false;
    if(config.urls.hasOwnProperty(host)) {
        found = true;
    }
    return found;
}
// Check if url key exists
function keyExists(host, key) {
    var found = false;
    if(hostExists(host) && config[domain].hasOwnProperty(key)) {
        found = true;
    }
    return found;
}
// Check if a url is an alias rather than an actual url
function isAlias(url) {
    var alias = false;
    if ((/^alias:/).test(url)) { // Regex to see if starts with 'alias:'
        alias = true;
    }
    return alias;
}