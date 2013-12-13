//Load app dependencies
var express = require('express'),
    http = require('http'),
    socketio = require('socket.io'),
    mongoose = require('mongoose');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);


app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//Sample routes are in a separate module, just for keep the code clean
routes = require('./router')(app);

app.use("/", express.static(__dirname + '/public'));

//Connect to the MongoDB test database
mongoose.connect('mongodb://localhost/users');

var connectedUsers = {};

io.sockets.on('connection', function (socket) {
  socket.on('msg', function (data) {
    var key = Date.now();
    
    connectedUsers[key] = data;
    socket.set('userkey', key);
    io.sockets.emit('new', data);    
    
  });

  socket.on("send location", function(data) {
    socket.get('userkey', function(err, key) {
      var user = connectedUsers[key];
      if(user) {
        user.lat = data.lat;
        user.lon = data.lon;
        user.key = key;
        data.key = key;
        io.sockets.emit("location update", data);
      }
    });
  });
  socket.on("request locations", function(sendData) {
    sendData(connectedUsers);
  })


});
//Start the server
server.listen(3000);
