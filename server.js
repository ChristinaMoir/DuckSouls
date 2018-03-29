// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser'); // get body-parser
var morgan = require('morgan'); // used to see requests
var mongoose = require('mongoose');
var config = require('./config');
var path = require('path');
// var socket = require('./app/routes/socket.js');

// Hook Socket.io into Express
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


// APP CONFIGURATION ==================
// ====================================
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to our database (hosted on modulus.io)
mongoose.connect(config.database);

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

// ROUTES FOR OUR API =================
// ====================================

// API ROUTES ------------------------
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// Socket.io Communication
var players = new Map();
var duckCount = new Map();
duckCount.set("stagingArea", []);
duckCount.set("levelOne", []);
duckCount.set("levelTwo", []);
duckCount.set("levelThree", []);

// io.sockets.on('connection', socket);
io.on('connection', function(socket) {
  // console.log("user connected");
  players.forEach(function(item, key, mapObj) {
    // console.log(item)
    socket.emit('draw_Player', {
      x: item.x,
      y: item.y,
      radius: item.radius,
      name: item.name,
      container: item.container
    })
  });
  duckCount.forEach(function(item, key, mapObj) {
    // console.log(item);
    for (var i = 0; i < item.length; i++) {
      io.sockets.emit('addDuck', {
        x: item[i][0],
        y: item[i][1],
        container: key
      });
    }
  });



  // add handler for message type "draw_line".
  socket.on('draw_Player', function(data) {
    // add received line to history
    players.set(data.name, {
      x: data.x,
      y: data.y,
      container: data.container,
      name: data.name,
      yellow: 0,
      blue: 0,
      green: 0
    });
    console.log(players.get(data.name))
    // send line to all clients
    io.emit('draw_Player', {
      x: data.x,
      y: data.y,
      radius: data.radius,
      name: data.name,
      container: data.container
    });
  });
  socket.on('send message', function(data) {
    io.sockets.emit('new message', {
      msg: data
    });
  });

  socket.on('addDuck', function(data) {
    // console.log(duckCount.get(data.container).length)
    var id = Math.floor(Math.random() * 2000 + Math.random() * 1000);
    // console.log("id:" + id)
    if (duckCount.get(data.container).length < 5) {
      io.sockets.emit('addDuck', {
        x: data.x,
        y: data.y,
        container: data.container,
        id: id
      });
      duckCount.get(data.container).push([data.x, data.y, id]);
    }
  });

  socket.on('moveLevel', function(data) {
    players.get(data.name).x = data.x;
    players.get(data.name).y = data.y;
    players.get(data.name).container = data.newLevel;
    io.sockets.emit('movedLevel', data);

  });

  socket.on('removeDuck', function(data) {
    //var type = data.duckType;
    players.get(data.name).yellow += 1;
    // console.log(players.get(data.name))
    for (var i = 0; i < duckCount.get(data.container).length; i++) {
      // console.log(duckCount.get(data.container)[i][2])
      // console.log(data.id);
      if (duckCount.get(data.container)[i][2] == data.id) {
        // console.log("true");
        duckCount.get(data.container).splice(i, 1);
      }
    }
    io.sockets.emit('removeDuck', data);


  });

  socket.on('move', function(data) {
    var playerMoved = players.get(data.name);
    var nextX = playerMoved.x;
    var nextY = playerMoved.y;
    var intersect = false;
    if (intersect) {
      io.sockets.emit('moved', {
        x: nextX,
        y: nextY,
        name: data.name,
        direction: data.direction,
        container: data.container,
        yellow: playerMoved.yellow,
        green: playerMoved.green,
        blue: playerMoved.blue
      });
      return;
    }


    //console.log(players);

    switch (data.direction) {
      case "left":
        {
          nextX -= 5;
          break;
        }
      case "up":
        {
          nextY -= 5;
          break;
        }
      case "right":
        {
          nextX += 5;
          break;
        }
      case "down":
        {
          nextY += 5;
          break;
        }
    }
    players.forEach(function(item, key, mapObj) {
      //console.log(item)
      if (item.name != data.name && item.container == data.container) {
        switch (data.direction) {
          case "left":
            {
              if ((nextX <= item.x + 8 && playerMoved.x > item.x - 8) && (nextY >= item.y - 16 && nextY <= item.y + 16)) {
                intersect = true;
              }
              break;
            }
          case "up":
            {
              if ((nextY <= item.y + 16 && playerMoved.y > item.y - 16) && (nextX >= item.x - 8 && nextX <= item.x + 8)) {
                intersect = true;
              }
              break;
            }
          case "right":
            {
              if ((nextX >= item.x - 8 && playerMoved.x < item.x + 8) && (nextY >= item.y - 16 && nextY <= item.y + 16)) {
                intersect = true;
              }
              break;
            }
          case "down":
            {
              if ((nextY >= item.y - 16 && playerMoved.y < item.y + 16) && (nextX >= item.x - 8 && nextX <= item.x + 8)) {
                intersect = true;
              }
              break;
            }
        }

      }
    });
    if (!intersect) {
      playerMoved.x = nextX;
      playerMoved.y = nextY;
      playerMoved.direction = data.direction;

    }
    io.sockets.emit('moved', {
      x: playerMoved.x,
      y: playerMoved.y,
      name: playerMoved.name,
      direction: data.direction,
      container: data.container,
      yellow: playerMoved.yellow,
      green: playerMoved.green,
      blue: playerMoved.blue
    });
  });

  socket.on('disconnect', function() {
    players.delete(socket.name);
    socket.broadcast.emit('player:left', {
      name: socket.name
    });
    console.log(socket.name + ' has disconnected from the chat.' + socket.id);
  });
  socket.on('join', function(name) {
    socket.name = name;
    console.log(socket.name + ' joined the chat.');
  });
});

// START THE SERVER
// ====================================
server.listen(config.port);
console.log('Magic happens on port ' + config.port);

// io.sockets.on('connection', function(socket) {
//   socket.on('new user', function(data, callback) {
//     if (nicknames.indexOf(data) != -1) {
//       callback(false);
//     } else {
//       callback(true)
//       socket.nickname = data;
//       nicknames.push(socket.nickname);
//       io.sockets.emit('usernames', nicknames);
//     }
//   });
//   socket.on('send message', function(data) {
//     io.sockets.emit('new message', {
//       msg: data,
//       nick: socket.nickname
//     });
//   });
// });
