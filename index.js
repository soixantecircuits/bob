var http = require('http'),
    auth = require('./credentials.js');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('BOB\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');