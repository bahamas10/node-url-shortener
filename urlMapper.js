var config = require(process.argv[2] || './config.json');

exports.map = function(req, res) {
    // Config option key strings
    var config_UseDefaultHost = 'use-default-host';
    var useDefaultHost = true;

    var config_UseDefaultKey = 'use-default-key';
    var useDefaultKey = false;

    var config_UseDefaultHostForRoot = 'use-default-host-for-root';
    var useDefaultHostForRoot = false;

    var config_UseDefaultKeyForRoot = 'use-default-key-for-root';
    var useDefaultKeyForRoot = false;

    var config_DefaultKey = 'index';
    var config_DefaultHost = 'default';
    var config_Config = 'config';

    var key = req.params[0];
    var host = req.hostname;
    var url;

    // Update config options
    if (config.hasOwnProperty(config_Config)) {
        if (config.hasOwnProperty(config_UseDefaultKey)) {
            useDefaultKey = config[config_UseDefaultKey];
        }
        if (config.hasOwnProperty(config_UseDefaultKeyForRoot)) {
            useDefaultKeyForRoot = config[config_UseDefaultKeyForRoot];
        }
        if (config.hasOwnProperty(config_UseDefaultHostForRoot)) {
            useDefaultHostForRoot = config[config_UseDefaultHostForRoot];
        }
        if (config.hasOwnProperty(config_UseDefaultHost)) {
            useDefaultHost = config[config_UseDefaultHost];
        }
        if (config.hasOwnProperty(config_UseDefaultHostKey)) {
            useDefaultHostAndKey = config[config_UseDefaultHostKey];
        }
    }

    // Check for null key
    if (key) {
        key = key.replace(/(\/$|\/\/$|\/\/\/$)/, ''); // remove trailing '/'
    } else {
        // Page requested on root
        key = config_DefaultKey;
        useDefaultKey = useDefaultKeyForRoot; // Use default key for empty (root)
        useDefaultHost = useDefaultHostForRoot; // Use default host for empty (root)
    }
    // Check key as requested
    if (keyExists(host, key)) {
        url = getUrl(host, key);
        res.redirect(url);
    }
    // Try for requested key on default host
    else if (keyExists(config_DefaultHost, key) && useDefaultHost) {
        url = getUrl(config_DefaultHost, key);
        res.redirect(url);
    }
    // Try for default key on requested host
    else if (keyExists(host, config_DefaultKey) && useDefaultKey) {
        url = getUrl(host, config_DefaultKey);
        res.redirect(url);
    }
    // Try for default key on default host
    else if (keyExists(config_DefaultHost, config_DefaultKey) && useDefaultHost && useDefaultKey) {
        url = getUrl(config_DefaultHost, config_DefaultKey);
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