var http = require('http'),
    auth = require('./credentials.js').auth,
    request = require('request'),
    Twitter = require('node-twitter'),
    wiki = require('nodemw');


var year = 1492;
var ListOfMonths = new Array ("January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December");
var DateTrouvee = 1234;
var eventFinal= "Evenement Vide";
var numberLoop = 0;
var worldAlive = true;

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('BOB\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

// pass configuration object
var clientWiki = new wiki({
  server: 'en.wikipedia.org',  // host name of MediaWiki-powered site
  path: '/w',                  // path to api.php script
  debug: false                // is more verbose when set to true
});

// Get one event from a date
function getPageYearWiki(year){
	if(worldAlive){
		// On tire un jour dans l'année au hasard, et on affiche sa page wikipedia
		var NumDay = Math.floor(Math.random()*28 + 1);
		var NumMonth = Math.floor(Math.random()*ListOfMonths.length);
		date=(String(ListOfMonths[NumMonth])+"_"+String(NumDay));

		var stopLoop = false;
		clientWiki.getArticle(date, function(data) {

			// On ne prend que ce que les "Events" de la page tirée au sort
			data=data.substring(data.indexOf("==Events==")+10,data.indexOf("==Births=="));

			array = data.split("*");

			for(i=0; i<array.length; i++){
				var eventTemp =array[i];
				var DateDebut = eventTemp.indexOf("[[");
				// Ajouter 2 à DateDebut pour choper le début de la chaine de caractere contenant l'année
				var DateFin= eventTemp.indexOf("]]");
				// DateFin est directement la bonne valeur
				DateTrouvee = parseInt(eventTemp.substring(DateDebut+2,DateFin).trim());

				if(year == DateTrouvee){
					stopLoop=true;
					eventFinal=array[i];
					eventFinal = eventFinal.replace(/[\[\]\(\)\']+/g, '');
					eventFinal = eventFinal.replace(/&[a-z]+;/g, '');
					eventFinal = eventFinal.replace(/<[^>]*>/g, '');
					eventFinal = String(eventFinal);
					eventFinal = date.replace("_"," ") + " "+ eventFinal;
					
					if(eventFinal.length>140){
						eventFinal = eventFinal.substring(0, 137);
						eventFinal+= "...";
					}
				}
			}
			loopDate(stopLoop, eventFinal);
		});
	}
}

function loopDate(stopLoop, eventFinal){
	if(worldAlive){
		if(!stopLoop){
			if(numberLoop<365){
				getPageYearWiki(year);
			} else {
				year++;
				getPageYearWiki(year);
				numberLoop = 0;
			}
			numberLoop++;
		} else {
			year++;
			numberLoop=0;
			console.log(eventFinal);
			//tweetWiki(eventFinal);
			var interval = 1; // en minutes
			interval*=60000;
			setTimeout(function(){
				getPageYearWiki(year);
			}, interval);
		}
	}
}
function destroyWorld(){
	worldAlive = false;
	year = 1492;
	var countdownDestroy = ["3", "2", "1"];
	var launchSentence = "Missiles engaged";
	var destroySentence = "BOB's world is dead";

	var interval = 1000;

	for(i=0; i<countdownDestroy.length; i++){
		setTimeout(function(){
			tweetWiki(countdownDestroy[i])
		}, interval);
		interval+=1000;
	}
	setTimeout(function(){
		twitterClient.statusesUpdateWithMedia({
		        'status': launchSentence,
		        'media[]': 'http://lotekness.net/wp-content/uploads/2012/12/Nuclear-Mushroom-Cloud.jpeg'
		    }, function (error, result) {
		        if (error) console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
		        if (result) console.log(result);
		    });
	}, interval);
	interval+=1000;

	setTimeout(function(){
		tweetWiki(destroySentence);
	}, interval);
	interval+=1000;

	setTimeout(function(){
		getPageYearWiki(year);
	}, interval);
}
getPageYearWiki(year);

// Get the page name and his url
function searchOnePageWiki(pageName){
	var options = {
	  host: 'en.wikipedia.org',
	  path: '/w/api.php?action=query&prop=info&inprop=url&format=json&titles='+pageName,
	};
	http.get(options, function(resp){
		resp.on('data', function(chunk){
			var data = JSON.parse(chunk).query.pages;
			for (var key in data) {
			  if (data.hasOwnProperty(key)) {
			  	var titre = data[key].title,
			  		url = data[key].fullurl;
			  		console.log(titre, url);
			  }
			}
		});
	}).on("error", function(e){
		console.log("Got error: " + e.message);
	});
}


var nytBaseUrl = "http://api.nytimes.com",
    nytFormat = ".json",
    nytBasePath = "/svc/search/v2/articlesearch" + nytFormat + "?"
    nytBeginDate = "&begin_date=20140729",
    nytEndDate = "&edn_date=20140729",
    nytSort = "&sort=newest",
    nytFieldList = "&fl=headline,web_url,multimedia",
    nytAPIKey = "&api-key=" + auth.NYT.KEY;

// var nytReqOpt = nytBaseUrl + nytBasePath + nytBeginDate + nytEndDate + nytSort + nytFieldList + nytAPIKey;

// request(nytReqOpt, function (error, response, body) {
//     if(error) console.log(error);
//     articles = JSON.parse(body).response.docs;
//     // console.log(articles);
//     getRandomArticle(articles);
// });

function getRandomArticle(dataset){
    var lucky = Math.floor(Math.random() * dataset.length);
    for (var i = 0; i < dataset.length; i++) {
        if(i == lucky){
            // tweetIt(dataset[i]);
            // pickedArticle = dataset[i];
            // console.log(pickedArticle);
        }
    };
}

var twitterClient = new Twitter.RestClient(
    auth.twitter.API_KEY,
    auth.twitter.API_SECRET,
    auth.twitter.TOKEN,
    auth.twitter.TOKEN_SECRET
);

function tweetItNYT(opt){
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

function tweetWiki(tweetString){
	twitterClient.statusesUpdate({
	        'status': tweetString,
	    }, function (err, res){
	        if(err) console.log(err);
	        if(res) console.log(res);
	    });
}

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