var config = require(process.argv[2] || './config.json');

exports.map = function(req, res) {
    var matchFound = false;

    // Get the requested url without any forward slashes at the end.

    var key = req.params[0];
    var host = req.hostname;
    var defaultKey = 'index';
    var defaultHost = 'default';
    var url;
    var useDefaultKey = false;
    if (config.hasOwnProperty('default-key-on-fail')) {
        useDefaultKey = config['default-key-on-fail'];
    }
    var useDefaultHost = false;
    if (config.hasOwnProperty('default-host-on-fail')) {
        useDefaultHost = config['default-host-on-fail'];
    }
    var useDefaultForEmpty = false;
    if (config.hasOwnProperty('default-on-empty-request')) {
        useDefaultForEmpty = config['default-on-empty-request'];
    }
    // Check for null key
    if (key) {
        key = key.replace(/(\/$|\/\/$|\/\/\/$)/, ''); // remove trailing '/'
    } else {
        key = defaultKey;
        useDefaultKey = useDefaultForEmpty;
    }
    // Check key as requested
    if (keyExists(host, key)) {
        url = getUrl(host, key);
        res.redirect(url);
    }
    // Try for requested key on default host
    else if (keyExists(defaultHost, key) && useDefaultHost) {
        url = getUrl(defaultHost, key);
        res.redirect(url);
    }
    // Try for default key on requested host
    else if (keyExists(host, defaultKey) && useDefaultKey) {
        url = getUrl(host, defaultKey);
        res.redirect(url);
    }
    // Try for default key on default host
    else if (keyExists(defaultHost, defaultKey) && useDefaultHost && useDefaultKey) {
        url = getUrl(defaultHost, defaultKey);
        res.redirect(url);
    }
    // Respond with error message
    else {
        res.end('Error, can not find url: ' + url + ' on host: ' + host);
    }
};
// Check hostname exists
function hostExists(host) {
    var found = false;
    if (config.urls.hasOwnProperty(host)) {
        found = true;
    } else {
        throw('Error, no such host: ' + host);
    }
    return found;
}

// Check if url key exists
function keyExists(host, key) {
    var found = false;
    if (hostExists(host)) {
        if (config.urls[host].hasOwnProperty(key)) {
            found = true;
        }
    } else {
        throw('Error, no such key: ' + key);
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

// Get the value of a key
function getRawUrl(host, key) {
    var urlVal = '';
    if (keyExists(host, key)) {
        urlVal = config.urls[host][key];
    }
    return urlVal;
}

// Strip alias of prefix
function stripAlias(aliasKey) {
    return aliasKey.replace(/^alias:/, '');
}

// Get url (resolves aliases)
function getUrl(host, key) {
    var url = getRawUrl(host, key);
    if (isAlias(url)) {
        var aliasKey = stripAlias(url);
        url = getRawUrl(host, aliasKey);
    }
    return url;
}