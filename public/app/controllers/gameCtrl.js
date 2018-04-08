angular.module('gameCtrl', ['gameService', 'authService'])

  .controller('gameController', function($scope, Auth, Chat, User, $routeParams, $window, AuthToken) {
    var vm = this;
    vm.username = "";
    vm.userID = "";
    var stage = new createjs.Stage("gameCanvas");
    //Background
    var grass = new createjs.Shape();
    var backFill = grass.graphics.beginFill('#3abe40').command;

    grass.graphics.drawRect(0, 0, stage.canvas.width, stage.canvas.height);
    grass.graphics.endFill();
    grass.name = "Walkable";

    stage.addChild(grass);
    //container for world
    var stagingArea = $scope.stagingArea = new createjs.Container();
    stagingArea.name = "stagingArea";
    //console.log(stagingArea);
    // stagingArea.x = 0;
    // stagingArea.y = 0;

    var levelOne = $scope.levelOne = new createjs.Container();
    levelOne.name = "levelOne";
    levelOne.x = stage.canvas.width / 2;
    levelOne.y = stage.canvas.height / 2;

    var levelTwo = $scope.levelTwo = new createjs.Container();
    levelTwo.name = "levelTwo";
    levelTwo.x = 0;
    levelTwo.y = 0;

    var levelThree = $scope.levelThree = new createjs.Container();
    levelThree.name = "levelThree";
    levelThree.x = 0;
    levelThree.y = 0;

    stage.addChild(stagingArea)
    console.log(stage)

    function handleImageLoad() {
      var data = event.path[0].data;
      var image = event.target;
      var bitmap = new createjs.Bitmap(image);
      console.log(data.id)
      console.log(event);
      // bitmap.scaleX = 0.1;
      // bitmap.scaleY = 0.1;
      bitmap.x = data.x;
      bitmap.y = data.y;
      bitmap.name = data.id;
      var container = $scope[data.container];
      container.addChild(bitmap);
      // socket.emit('updateDuck', {
      //   x: data.x,
      //   y: data.y,
      //   id: bitmap.id,
      //   container: data.container
      // });
      //console.log(container);
    }

    var fontImg = new Image();
    fontImg.src = "assets/img/font.png";
    var fonts = new createjs.SpriteSheet({
      images: [fontImg],
      frames: {
        width: 8,
        height: 8,
        regX: 0,
        regY: 0,
        spacing: 0,
        margin: 0
      }
    });

    var image = new Image();
    image.src = "assets/img/Overworld.png";
    var ss = new createjs.SpriteSheet({
      images: [image],
      frames: {
        width: 16,
        height: 16,
        regX: 0,
        regY: 0,
        spacing: 0,
        margin: 0
      },
      animations: {
        waterfallStartLeft: [377, 377, "waterfallMiddleLeft", 0.3],
        waterfallMiddleLeft: [417, 417, "waterfallEndLeft", 0.3],
        waterfallEndLeft: [458, 458, "waterfallStartLeft", 0.3],
        waterfallStartRight: [379, 379, "waterfallMiddleRight", 0.3],
        waterfallMiddleRight: [419, 419, "waterfallEndRight", 0.3],
        waterfallEndRight: [460, 460, "waterfallStartRight", 0.3],
        waterfallStartMiddle: [378, 378, "waterfallMiddleMiddle", 0.3],
        waterfallMiddleMiddle: [418, 418, "waterfallEndMiddle", 0.3],
        waterfallEndMiddle: [459, 459, "waterfallStartMiddle", 0.3],
        waterfallStartBottom: [338, 338, "waterfallMiddleBottom", 0.3],
        waterfallMiddleBottom: [339, 339, "waterfallEndBottom", 0.3],
        waterfallEndBottom: [340, 340, "waterfallStartBottom", 0.3],
        waterfallStartTop: [258, 258, "waterfallMiddleTop", 0.3],
        waterfallMiddleTop: [259, 259, "waterfallEndTop", 0.3],
        waterfallEndTop: [260, 260, "waterfallStartTop", 0.3],
        waterfallStartCentre: [298, 289, "waterfallMiddleCentre", 0.3],
        waterfallMiddleCentre: [299, 299, "waterfallEndCentre", 0.3],
        waterfallEndCentre: [300, 300, "waterfallStartCentre", 0.3]
      }
    });

    var girl = new Image();
    girl.src = "assets/img/character.png";
    // create spritesheet and assign the associated data.
    var spriteSheet = new createjs.SpriteSheet({
      // image to use
      images: [girl],
      framerate: 4,
      // width, height & registration point of each sprite
      frames: [
        [0, 0, 16, 32],
        [128, 0, 32, 32]
      ],
      animations: {
        down: [0, 3, "down", 1],
        right: [17, 20, "right", 1],
        left: [51, 54, "left", 1],
        up: [34, 37, "up", 1],
        idleDown: {
          frames: [5, 6, 7, 9, 10, 11, 12, 6],
          next: "idleDown",
          speed: 0.5
        },
        idleUp: {
          frames: [39, 40, 41, 43, 44, 45, 46],
          next: "idleUp",
          speed: 0.5
        },
        idleLeft: {
          frames: [56, 57, 58, 60, 61, 62, 63],
          next: "idleLeft",
          speed: 0.5
        },
        idleRight: {
          frames: [22, 23, 24, 26, 27, 28, 29],
          next: "idleRight",
          speed: 0.5
        },
        attackDown: [68, 71, "idleDown", 1],
        attackUp: [77, 80, "idleUp", 1],
        attackRight: [86, 89, "idleRight", 1],
        attackLeft: [95, 98, "idleLeft", 1]
      }

    });



    //createjs.Ticker.setFPS(30);
    createjs.Ticker.on("tick", tick);

    function tick(event) {
      var rand = Math.random() * 1000;
      if (rand > 990) {
        var randX = Math.floor(Math.random() * stage.canvas.width);
        var randY = Math.floor(Math.random() * stage.canvas.height);
        var container = stage.getChildAt(1);
        if (!container.getObjectUnderPoint(randX, randY) || container.getObjectUnderPoint(randX, randY).name == "Walkable") {
          socket.emit('addDuck', {
            //  x: player.x,
            //  y: player.y,
            x: randX,
            y: randY,
            container: container.name
          });
        }

      }
      stage.update(event);
    }

    // define a tile map:
    // var map = [
    //   [1, 1, 1, 1, 1, 1, 1, 2, 2, 3],
    //   [9, 10, 10, 10, 10, 10, 10, 10, 10, 11],
    //   [9, 10, 10, 10, 20, 21, 10, 10, 10, 11],
    //   [17, 18, 18, 18, 19, 17, 18, 18, 18, 19],
    //   [30, 30, 31, 30, 6, 8, 46, 30, 40, 30],
    //   [30, 30, 40, 32, 14, 16, 30, 30, 30, 30],
    //   [30, 30, 30, 30, 14, 16, 48, 30, 31, 30],
    //   [40, 30, 48, 31, 14, 16, 30, 40, 30, 30],
    //   [30, 30, 30, 30, 14, 16, 30, 48, 32, 30],
    //   [30, 30, 40, 30, 14, 16, 30, 30, 30, 30]
    // ]



    $.getJSON("assets/maps/stagingArea.json", function(data) {

      $.each(data.layers, function(key, val) {

        console.log(val);
        // draw the map:
        var count = 0;

        for (var row = 0; row < stage.canvas.height; row += 16) {
          for (var col = 0; col < stage.canvas.width; col += 16) {

            var num = val.data[count] - 1;
            if (num >= 0) {
              var tile = new createjs.Sprite(ss);
              tile.gotoAndStop(num);
              tile.x = col;
              tile.y = row;
              tile.name = val.name;
              stagingArea.addChild(tile);
            }
            count++;
          }
        }
        var tile = new createjs.Sprite(fonts);
        tile.gotoAndStop(180);
        tile.x = 192;
        tile.y = 52;
        tile.name = "1";
        stagingArea.addChild(tile);
        var tile = new createjs.Sprite(fonts);
        tile.gotoAndStop(209);
        tile.x = 200;
        tile.y = 52;
        tile.name = "1";
        stagingArea.addChild(tile);
        var tile = new createjs.Sprite(fonts);
        tile.gotoAndStop(420);
        tile.x = 192;
        tile.y = 60;
        tile.name = "1";
        stagingArea.addChild(tile);
        var tile = new createjs.Sprite(fonts);
        tile.gotoAndStop(449);
        tile.x = 200;
        tile.y = 60;
        tile.name = "1";
        stagingArea.addChild(tile);
        var tile = new createjs.Sprite(fonts);
        tile.gotoAndStop(28);
        tile.x = 196;
        tile.y = 56;
        tile.name = "1";
        stagingArea.addChild(tile);


        var tile = new createjs.Sprite(fonts);
        tile.gotoAndStop(180);
        tile.x = 304;
        tile.y = 300;
        tile.name = "2";
        stagingArea.addChild(tile);
        var tile = new createjs.Sprite(fonts);
        tile.gotoAndStop(209);
        tile.x = 312;
        tile.y = 300;
        tile.name = "2";
        stagingArea.addChild(tile);
        var tile = new createjs.Sprite(fonts);
        tile.gotoAndStop(420);
        tile.x = 304;
        tile.y = 308;
        tile.name = "2";
        stagingArea.addChild(tile);
        var tile = new createjs.Sprite(fonts);
        tile.gotoAndStop(449);
        tile.x = 312;
        tile.y = 308;
        tile.name = "2";
        stagingArea.addChild(tile);
        var tile = new createjs.Sprite(fonts);
        tile.gotoAndStop(29);
        tile.x = 308;
        tile.y = 304;
        tile.name = "2";
        stagingArea.addChild(tile);

        var tile = new createjs.Sprite(fonts);
        tile.gotoAndStop(180);
        tile.x = 416;
        tile.y = 80;
        tile.name = "3";
        stagingArea.addChild(tile);
        var tile = new createjs.Sprite(fonts);
        tile.gotoAndStop(209);
        tile.x = 424;
        tile.y = 80;
        tile.name = "3";
        stagingArea.addChild(tile);
        var tile = new createjs.Sprite(fonts);
        tile.gotoAndStop(420);
        tile.x = 416;
        tile.y = 88;
        tile.name = "3";
        stagingArea.addChild(tile);
        var tile = new createjs.Sprite(fonts);
        tile.gotoAndStop(449);
        tile.x = 424;
        tile.y = 88;
        tile.name = "3";
        stagingArea.addChild(tile);
        var tile = new createjs.Sprite(fonts);
        tile.gotoAndStop(57);
        tile.x = 420;
        tile.y = 84;
        tile.name = "3";
        stagingArea.addChild(tile);

      });
      var waterfallLeft = new createjs.Sprite(ss);
      waterfallLeft.gotoAndPlay("waterfallStartLeft");
      waterfallLeft.x = 608;
      waterfallLeft.y = 336;
      var waterfallMiddle = new createjs.Sprite(ss);
      waterfallMiddle.gotoAndPlay("waterfallStartMiddle");
      waterfallMiddle.x = 624;
      waterfallMiddle.y = 336;
      var waterfallRight = new createjs.Sprite(ss);
      waterfallRight.gotoAndPlay("waterfallStartRight");
      waterfallRight.x = 640;
      waterfallRight.y = 336;

      var waterfallBottom = new createjs.Sprite(ss);
      waterfallBottom.gotoAndPlay("waterfallStartBottom");
      waterfallBottom.x = 624;
      waterfallBottom.y = 320;
      var waterfallCentre = new createjs.Sprite(ss);
      waterfallCentre.gotoAndPlay("waterfallStartCentre");
      waterfallCentre.x = 624;
      waterfallCentre.y = 304;
      var waterfallCentre2 = new createjs.Sprite(ss);
      waterfallCentre2.gotoAndPlay("waterfallStartCentre");
      waterfallCentre2.x = 624;
      waterfallCentre2.y = 288;
      var waterfallTop = new createjs.Sprite(ss);
      waterfallTop.gotoAndPlay("waterfallStartTop");
      waterfallTop.x = 624;
      waterfallTop.y = 272;

      stagingArea.addChild(waterfallLeft, waterfallMiddle, waterfallRight,
        waterfallBottom, waterfallCentre, waterfallCentre2, waterfallTop);

    })

    $.getJSON("assets/maps/levelOne.json", function(data) {

      $.each(data.layers, function(key, val) {

        // console.log(val);
        // draw the map:
        var count = 0;

        for (var row = 0; row < 720; row += 16) {
          for (var col = 0; col < 1120; col += 16) {

            var num = val.data[count] - 1;
            if (num >= 0) {
              var tile = new createjs.Sprite(ss);
              tile.gotoAndStop(num);
              tile.x = col;
              tile.y = row;
              tile.name = val.name;
              levelOne.addChild(tile);
            }
            count++;
          }
        }
      });
    });
    // var sea = new createjs.Shape();
    // sea.graphics.beginFill('#1e7cb8');
    // sea.graphics.drawRect(0, (stage.canvas.height / 2) + 15, stage.canvas.width, stage.canvas.height / 2);
    // sea.graphics.endFill();
    //
    // stage.addChild(sea);

    // // draw the map:
    // for (var row = 0; row < (stage.canvas.height / 2); row += 15) {
    //   for (var col = 0; col < stage.canvas.width; col += 15) {
    //     //var idx = map[row][col] - 1;
    //     var rand = Math.random() * 4;
    //     if (rand > 3) {
    //       var tile = new createjs.Sprite(ss);
    //       tile.gotoAndStop(0);
    //       tile.x = col;
    //       tile.y = row;
    //       stage.addChild(tile);
    //     }
    //
    //   }
    // }
    // // draw the map:
    // for (var row = (stage.canvas.height / 2) + 15; row < stage.canvas.height; row += 15) {
    //   for (var col = 0; col < stage.canvas.width; col += 15) {
    //     //var idx = map[row][col] - 1;
    //     var rand = Math.random() * 4;
    //     if (rand > 3) {
    //       var tile = new createjs.Sprite(ss);
    //       tile.gotoAndStop(40);
    //       tile.x = col;
    //       tile.y = row;
    //       stage.addChild(tile);
    //     }
    //   }
    // }

    // update the stage to draw to screen:
    stage.update();


    //makes lines sharper
    // stage.regX = -0.5;
    // stage.regY = -0.5;
    var socket = io.connect();
    $('#gameCanvas').focus();

    Auth.getUser()
      .then(function(data) {
        // console.log(data.data)
        vm.username = data.data.username;
        vm.userID = data.data.userID;
        socket.on('connect', function(data) {
          socket.emit('join', vm.username);
        });

        User.get(vm.userID)
          .then(function(data) {
            // console.log(data);
            //create player
            socket.emit('draw_Player', {
              x: Math.floor(Math.random() * 100),
              y: 20,
              name: vm.username,
              direction: "down",
              container: "stagingArea",
              green: data.data.green,
              yellow: data.data.yellow,
              pink: data.data.pink,
              blue: data.data.blue,
              score: data.data.score
            });
          });

      });
    Chat.all()
      .then(function(data) {
        // bind the users that come back to vm.users
        //console.log(data.data);
        vm.messages = data.data;
      });



    // var circle = new createjs.Shape();
    // circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 10);
    // circle.x = 20;
    // circle.y = 20;
    // circle.name = vm.username;
    // stage.addChild(circle);
    // stage.update();

    vm.focus = function(event) {
      // console.log(event);
      event.target.focus();

    }
    vm.move = function(event) {
      event.preventDefault();
      var currStage = stage.getChildAt(1).name;
      var player = stage.getChildAt(1).getChildByName(vm.username);
      var intersect = false;
      var direction = "down";
      var x = player.x;
      var y = player.y;
      if (event.keyCode == 37) {
        direction = "left";
        x -= 5;
      }
      //up
      if (event.keyCode == 38) {
        direction = "up";
        y -= 5;
      }
      //right
      if (event.keyCode == 39) {
        direction = "right";
        x += 5;
      }
      //down
      if (event.keyCode == 40) {
        direction = "down";
        y += 5;
      }
      stage.update();
      intersect = nonWalkable(player, stage.getChildAt(1), x, y, direction)
      // socket.emit('move', {
      //   x: player.x,
      //   y: player.y,
      //   name: player.name
      // });
      socket.emit('move', {
        //  x: player.x,
        //  y: player.y,
        name: player.name,
        direction: direction,
        intersect: intersect,
        container: currStage
      });

    }

    socket.on('addDuck', function(data) {
      var duck = new Image();
      if (data.container == "stagingArea") {
        duck.src = "assets/img/duckPng.png";
      } else if (data.container == "levelOne") {
        duck.src = "assets/img/duckGreen.png";
      } else if (data.container == "levelTwo") {
        duck.src = "assets/img/duckPink.png";
      } else if (data.container == "levelThree") {
        duck.src = "assets/img/duckBlue.png";
      }

      duck.data = {
        x: data.x,
        y: data.y,
        container: data.container,
        target: duck.src,
        id: data.id
      };
      duck.onload = handleImageLoad;
    })

    socket.on('draw_Player', function(data) {

      var animation = new createjs.Sprite(spriteSheet, "down");
      //console.log($scope[data.stage]);
      var container = $scope[data.container];
      animation.x = data.x;
      animation.y = data.y;
      animation.name = data.name;
      container.addChild(animation);
      stage.update();
      // var circle = new createjs.Shape();
      // circle.graphics.beginFill("gold").drawCircle(0, 0, data.radius);
      // circle.x = data.x;
      // circle.y = data.y;
      // circle.name = data.name;
      // stage.addChild(circle);
      // stage.update();
    })

    socket.on('moved', function(data) {
      //console.log(data.direction);
      var container = $scope[data.container];
      var newPos = container.getChildByName(data.name);

      container.setChildIndex(newPos, container.children.length - 1);
      createjs.Tween.get(newPos).to({
        x: data.x,
        y: data.y
      });
      if (data.direction != newPos.currentAnimation) {
        newPos.gotoAndPlay(data.direction);
        console.log(data.direction);
      }
      stage.update();
      if (vm.username == data.name && stage.getChildAt(1).name != "stagingArea") {
        container.regX = data.x;
        container.regY = data.y;

      }
      onDuck(data);
      if (data.container == "stagingArea") {
        if ((data.x >= 208 && data.x <= 224) && (data.y >= 64 && data.y <= 80)) {
          //console.log(data.yellow)
          if (data.yellow >= 5) {
            nextLevel(data, "levelOne", "#d5d5d5");
          } else {
            moreDucks(data.yellow, 5 - data.yellow, "yellow");
          }
        }

        if ((data.x >= 304 && data.x <= 320) && (data.y >= 310 && data.y <= 325)) {
          if (data.green >= 15) {
            nextLevel(data, "levelTwo", "black");
          } else {
            moreDucks(data.green, 15 - data.green, "green");
          }
        }

        if ((data.x >= 400 && data.x <= 416) && (data.y >= 80 && data.y <= 100)) {
          if (data.pink >= 30) {
            nextLevel(data, "levelThree", "green");
          } else {
            moreDucks(data.pink, 30 - data.pink, "pink");
          }
        }
      }


    });

    function moreDucks(numDucks, missingDucks, colour) {
      alert("You have " + numDucks + " " + colour + " ducks. You need " + missingDucks + " more to access this level.");
    }

    function nonWalkable(player, container, x, y, direction) {

      if (direction == "left") {
        var obj = container.getObjectsUnderPoint(x, y + 16);
      } else if (direction == "right") {
        var obj = container.getObjectsUnderPoint(x + 8, y + 16);
      } else if (direction == "up") {
        var obj = container.getObjectsUnderPoint(x + 4, y);
      } else if (direction == "down") {
        var obj = container.getObjectsUnderPoint(x + 4, y + 21);
      }

      if ((obj[0] && obj[0].name == "Base") || (obj[1] && obj[1].name == "Base") || (obj[2] && obj[2].name == "Base")) {
        return true;
      } else {
        return false;
      }


    }


    function nextLevel(data, level, colour) {
      console.log(colour);
      socket.emit('moveLevel', {
        //  x: player.x,
        //  y: player.y,
        name: data.name,
        x: Math.floor(Math.random() * 100),
        y: 20,
        newLevel: level,
        oldLevel: "stagingArea",
        col: colour
      });
    }

    socket.on('movedLevel', function(data) {
      backFill.style = data.col;
      console.log(data.col);
      var newLevel = $scope[data.newLevel];
      var oldLevel = $scope[data.oldLevel];
      var playerToMove = oldLevel.getChildByName(data.name);
      oldLevel.removeChild(playerToMove);
      newLevel.addChild(playerToMove);

      newLevel.regX = playerToMove.x;
      newLevel.regY = playerToMove.y;
      stage.removeChildAt(1);
      stage.addChild(newLevel);
      stage.update();
    })

    function onDuck(data) {
      var container = $scope[data.container];
      var obj = container.getObjectsUnderPoint(data.x + 8, data.y + 16);
      //console.log(obj);
      if (obj[1] && obj[1].image) {
        socket.emit('removeDuck', {
          //  x: player.x,
          //  y: player.y,
          name: data.name,
          container: data.container,
          id: obj[1].name
        });
      }
    }

    socket.on('removeDuck', function(data) {
      var container = $scope[data.container];
      var duck = container.getChildByName(data.id);
      //  console.log(duck);
      container.removeChild(duck);

      var score = (data.yellow * 1) + (data.green * 2) + (data.pink * 3) + (data.blue * 4);

      // call the userService function to update
      if (data.name == vm.username) {
        User.update(vm.userID, {
            user_id: vm.userID,
            yellow: data.yellow,
            green: data.green,
            blue: data.blue,
            pink: data.pink,
            score: score
          })
          .then(function(data) {
            // bind the message from our API to game.message
            vm.message = data.message;
          });
      }
    })

    socket.on('player:left', function(data) {
      var container = $scope[data.container];
      var left = container.getChildByName(data.name);
      container.removeChild(left);
      stage.update();
    })



    vm.newMessage = function() {
      //console.log(vm.gameData)
      vm.gameData.username = vm.username;
      Chat.create(vm.gameData)
        .then(function(data) {
          //  console.log(data);
          vm.gameData = {}
          socket.emit('send message', data);
        });
    }



    socket.on('new message', function(data) {
      Chat.all()
        .then(function(data) {
          // bind the users that come back to vm.users
          //  console.log(data);
          vm.messages = data.data;
        });
      // console.log(data);

      // $chat.append('<strong>' + data.nick + '</strong>: ' + data.msg + "<br/>");
    });
  });
