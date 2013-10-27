var WebSocketServer = require('ws').Server,
    http = require('http'),
    express = require('express'),
    app = express();

app.use(express.logger());
app.use(express.static(__dirname));
app.use(express.directory(__dirname));

var server = http.createServer(app);
server.listen(8080);
console.log('Listening on http://localhost:8080');

var db = {};

app.post('/data', express.urlencoded(), function(req, res) {
  db = req.body;
  res.send(200);
});

var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(process.memoryUsage()), function() { /* ignore errors */ });
  }, 100);
  console.log('started client interval');
  ws.on('close', function() {
    console.log('stopping client interval');
    clearInterval(id);
  });
});
