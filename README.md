url-shortener
=============

Spawn up a simple webserver to act as a URL shortener

Usage
=====

### Terminal 1
    $ ./app.js
    Server listening on localhost:8090
    { paste: 'http://www.pastebin.com',
      github: 'https://github.com' }
    Request received /
    Request received /paste

### Terminal 2
    $ curl -s localhost:8090 | json
    {
      "paste": "http://www.pastebin.com",
      "github": "https://github.com"
    }
    $ curl -I localhost:8090/paste
    HTTP/1.1 302 Moved Temporarily
    Location: http://www.pastebin.com
    Connection: keep-alive

Config
======

There are 2 config files.  The first is `config.json`, and in there you define the host
and port the server should listen on, and the URLs json file to use.  The second
is `urls.json`, and this is key-value file of path to URL.

### config.json
``` json
{
  "host": "localhost",
  "port": 8090,
  "urls": "urls.json"
}
```

### urls.json
``` json
{
  "paste": "http://www.pastebin.com",
  "github": "https://github.com"
}
```

License
=======

MIT Licensed
