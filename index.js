var http = require('http'),
    auth = require('./credentials.js');

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