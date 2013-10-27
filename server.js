var http = require('http'),
    express = require('express'),
    app = express();

app.use(express.logger());
app.use(express.static(__dirname));
app.use(express.directory(__dirname));

var server = http.createServer(app);
server.listen(process.env.PORT || 8080);
console.log('Listening on http://localhost:8080');

var db = [
  {
    "label" : "Trumpet",
    "notes" : [[0],[1],[2],[3],[4],[3],[4],[3],[4],[3],[2],[1],[0],[0],[0],[0]],
    "audioClips" : [
      "sounds/funkshots Trumpet-1.wav",
      "sounds/funkshots Trumpet-3.wav",
      "sounds/funkshots Trumpet-5.wav",
      "sounds/funkshots Trumpet-7.wav",
      "sounds/funkshots Trumpet-8.wav"
    ]
  },
  {
    "label": "Bass",
    "notes": [[1],[1],[1],[1],[0],[0],[0],[0],[3],[3],[3],[3],[0],[0],[0],[0]],
    "audioClips" : [
      "sounds/funkshots Bass-1.wav",
      "sounds/funkshots Bass-3.wav",
      "sounds/funkshots Bass-5.wav",
      "sounds/funkshots Bass-7.wav",
      "sounds/funkshots Bass-8.wav"
    ]
  }
];

app.post('/data', express.urlencoded(), function(req, res) {
  db = req.body;
  res.send(200);
});

app.get('/data', function(req, res) {
  res.json(db);
});
