var http = require('http'),
    auth = require('./credentials.js').auth,
    Twitter = require('node-twitter');

console.log(tweet);

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('BOB\n');
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

var twitterClient = new Twitter.RestClient(
    auth.API_KEY,
    auth.API_SECRET,
    auth.TOKEN,
    auth.TOKEN_SECRET
);

// twitterClient.statusesUpdate({
//         'status': 'Hello world.'
//     }, function(err, res){
//         if(err) console.log(err);
//         if(res) console.log(res);
//     });


// twitterClient.statusesUpdateWithMedia({
//         'status': 'Hello.',
//         'media[]': ''
//     }, function(error, result) {
//         if (error) console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
//         if (result) console.log(result);
//     });