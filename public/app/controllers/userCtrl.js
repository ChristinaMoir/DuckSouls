angular.module('userCtrl', ['userService', 'authService'])

  .controller('userController', function(User, $rootScope) {

    var vm = this;

    // set a processing variable to show loading things
    vm.processing = true;

    // grab all the users at page load
    User.all()
      .then(function(data) {

        // when all the users come back, remove the processing variable
        vm.processing = false;

        // bind the users that come back to vm.users
        vm.users = data.data;
        vm.users.sort(compareNumbers);
      });

    function compareNumbers(a, b) {
      return b.score - a.score;
    }

    $rootScope.$on('$routeChangeStart', function() {
      User.all()
        .then(function(data) {

          // when all the users come back, remove the processing variable
          vm.processing = false;

          // bind the users that come back to vm.users
          vm.users = data.data;
          vm.users.sort(compareNumbers);
        });
    });

    // function to delete a user
    vm.deleteUser = function(id) {
      vm.processing = true;

      User.delete(id)
        .then(function(data) {

          // get all users to update the table
          // you can also set up your api
          // to return the list of users with the delete call
          User.all()
            .then(function(data) {
              vm.processing = false;
              vm.users = data.data;
            });

        });
    };

  })

  // controller applied to user creation page
  .controller('userCreateController', function(User, $location, Auth) {

    var vm = this;

    // variable to hide/show elements of the view
    // differentiates between create or edit pages
    vm.type = 'create';

    // function to create a user
    vm.saveUser = function() {
      vm.processing = true;
      vm.message = '';

      // use the create function in the userService
      User.create(vm.userData)
        .then(function(data) {
          console.log(vm.userData);
          if (data.data.success) {
            vm.processing = true;
            Auth.login(vm.userData.username, vm.userData.password)
              .then(function(data) {
                vm.processing = false;
                // if a user successfully logs in, redirect to users page
                if (data.success) {
                  vm.processing = false;
                  vm.userData = {};
                  vm.message = data.message;
                  console.log('success');
                  $location.path('/');
                } else {
                  vm.error = data.message;
                  console.log('fail');
                }

              });
          } else {
            vm.error = data.message;
            console.log('fail');
          }
        });

    };

  })

  // controller applied to user edit page
  .controller('userEditController', function($routeParams, User, $location, Auth) {

    var vm = this;

    // variable to hide/show elements of the view
    // differentiates between create or edit pages
    vm.type = 'edit';

    // get the user data for the user you want to edit
    // $routeParams is the way we grab data from the URL
    User.get($routeParams.user_id)
      .then(function(data) {
        vm.userData = data;
      });

    // function to save the user
    vm.saveUser = function() {
      vm.processing = true;
      vm.message = '';

      // call the userService function to update
      User.update($routeParams.user_id, vm.userData)
        .then(function(data) {
          vm.processing = false;

          // bind the message from our API to vm.message
          vm.message = data.message;

          Auth.login(vm.userData.username, vm.userData.password)
            .then(function(data) {
              console.log(data);
              vm.processing = false;
              // if a user successfully logs in, redirect to users page
              if (data.success) {
                console.log('success');
                $location.path('/');
              } else {
                vm.error = data.message;
                console.log('fail');
              }
              vm.userData = {};

            });
        });
    };

  });
