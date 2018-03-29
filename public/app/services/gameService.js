angular.module('gameService', [])

  .factory('Chat', function($rootScope, $http) {

    // create a new object
    var chatFactory = {};


    // get all users
    chatFactory.all = function() {
      return $http.get('/api/messages/');
    };

    // create a user
    chatFactory.create = function(gameData) {
      return $http.post('/api/messages/create', gameData);
    };

    // return our entire userFactory object
    return chatFactory;
  });
