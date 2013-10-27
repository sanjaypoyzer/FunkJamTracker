var http = require('http'),
    express = require('express'),
    app = express();

app.use(express.logger());
app.use(express.static(__dirname));
app.use(express.directory(__dirname));

var server = http.createServer(app);
server.listen(8080);
console.log('Listening on http://localhost:8080');

var db = [
  {
    "label" : "Trumpet",
    "notes" : [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]],
    "audioClips" : ["sounds/trumpet.mp3"]
  }
  ];

app.post('/data', express.urlencoded(), function(req, res) {
  db = req.body;
  res.send(200);
});

app.get('/data', function(req, res) {
  res.json(db);
});
