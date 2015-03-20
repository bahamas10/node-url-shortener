url-shortener
=============

Spawn up a simple webserver to act as a URL shortener

Usage
-----

### Terminal 1

    $ url-shortener
    [2013-01-11T23:29:43.579Z] server listening on http://localhost:8090
    { github: 'https://github.com', paste: 'http://pastebin.com' }
    [2013-01-11T23:29:56.600Z] 127.0.0.1 GET 200 / (2ms)
    [2013-01-11T23:29:59.214Z] 127.0.0.1 GET 301 /paste (1ms)


### Terminal 2

    $ curl -s localhost:8090 | json
    {
      "paste": "http://www.pastebin.com",
      "github": "https://github.com"
    }
    $ curl -I localhost:8090/paste
    HTTP/1.1 301 Moved Permanently
    Location: http://www.pastebin.com
    Connection: keep-alive

Config
------

pass the config file name as the first argument

### config.json

``` json
{
  "host": "localhost",
  "port": 8090,
  "gid": null,
  "uid": null,
  "domains": {
    "google": {
      "index": "http://google.com",
      "maps": "http://maps.google.com",
      "mail": "http://mail.google.com"
    }
  }
}
```

Then use nginx/apache to do a passthrough to
`localhost://domain`

This allows multiple domain names to use the same shortener instance with seperate short urls.
Also adds a default/index page for each domain named "index"
Eg. `localhost://google` will redirect to `http://google.com`

Install
-------

    npm install -g url-shortener

License
-------

MIT Licensed
