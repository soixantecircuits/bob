var http = require('http'),
    auth = require('./credentials.js').auth,
    request = require('request'),
    _ = require('underscore'),
    Twitter = require('node-twitter');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('BOB\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

var options = {
  host: 'en.wikipedia.org',
  path: '/w/api.php?action=query&prop=info&inprop=url&format=json&titles=France'
};

http.get(options, function(resp){
	resp.on('data', function(chunk){
		var data = JSON.parse(chunk).query.pages;
		for (var key in data) {
		  if (data.hasOwnProperty(key)) {
		  	var titre = data[key].title,
		  		url = data[key].fullurl;
		  }
		}
	});
}).on("error", function(e){
	console.log("Got error: " + e.message);
});

console.log('Server running at http://127.0.0.1:1337/');

var nytBaseUrl = "http://api.nytimes.com",
    nytFormat = ".json",
    nytBasePath = "/svc/search/v2/articlesearch" + nytFormat + "?"
    nytBeginDate = "&begin_date=20140729",
    nytEndDate = "&edn_date=20140729",
    nytSort = "&sort=newest",
    nytFieldList = "&fl=headline,web_url,multimedia",
    nytAPIKey = "&api-key=" + auth.NYT.KEY;

var nytReqOpt = nytBaseUrl + nytBasePath + nytBeginDate + nytEndDate + nytSort + nytFieldList + nytAPIKey;

request(nytReqOpt, function (error, response, body) {
    if(error) console.log(error);
    articles = JSON.parse(body).response.docs;
    // console.log(articles);
    getRandomArticle(articles);
});

function getRandomArticle(dataset){
    var lucky = Math.floor(Math.random() * dataset.length);
    for (var i = 0; i < dataset.length; i++) {
        if(i == lucky){
            tweetIt(dataset[i]);
            // pickedArticle = dataset[i];
            // console.log(pickedArticle);
        }
    };
}

function tweetIt(opt){
    if(opt.multimedia[0]){
        twitterClient.statusesUpdateWithMedia({
                'status': opt.headline.main + "\n" + opt.web_url,
                'media[]' : 'http://nytimes.com/' + opt.multimedia[0].url
            }, function (err, res){
                if(err) console.log(err);
                if(res) console.log(res);
            });
    } else {
        twitterClient.statusesUpdate({
                    'status': opt.headline.main + "\n" + opt.web_url,
                }, function (err, res){
                    if(err) console.log(err);
                    if(res) console.log(res);
                });
    }
}

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