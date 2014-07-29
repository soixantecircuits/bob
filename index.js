var http = require('http'),
    auth = require('./credentials.js').auth,
    request = require('request'),
    Twitter = require('node-twitter');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('BOB\n');
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

var nytBaseUrl = "http://api.nytimes.com",
    nytFormat = ".json",
    nytBasePath = "/svc/search/v2/articlesearch" + nytFormat + "?"
    nytBeginDate = "&begin_date=20140729",
    nytEndDate = "&edn_date=20140729",
    nytSort = "&sort=newest",
    nytFieldList = "&fl=headline,web_url",
    nytAPIKey = "&api-key=" + auth.NYT.KEY;

var nytReqOpt = nytBaseUrl + nytBasePath + nytBeginDate + nytEndDate + nytSort + nytFieldList + nytAPIKey

request(nytReqOpt, function (error, response, body) {
    if(error) console.log(error);
    articles = JSON.parse(body).response.docs;
    console.log(articles);
});

var twitterClient = new Twitter.RestClient(
    auth.twitter.API_KEY,
    auth.twitter.API_SECRET,
    auth.twitter.TOKEN,
    auth.twitter.TOKEN_SECRET
);

// twitterClient.statusesUpdate({
//         'status': 'Hello world.'
//     }, function (err, res){
//         if(err) console.log(err);
//         if(res) console.log(res);
//     });

// twitterClient.statusesUpdateWithMedia({
//         'status': 'Hello.',
//         'media[]': ''
//     }, function (error, result) {
//         if (error) console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
//         if (result) console.log(result);
//     });