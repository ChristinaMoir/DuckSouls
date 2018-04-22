angular.module('mainCtrl', [])

  .controller('mainController', function($rootScope, $location, Auth) {

    var vm = this;

    // get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();
    // vm.admin = Auth.admin();

    // check to see if a user is logged in on every request
    $rootScope.$on('$routeChangeStart', function() {
      vm.loggedIn = Auth.isLoggedIn();
      // vm.admin = Auth.admin();
      // get user information on page load
      Auth.getUser()
        .then(function(data) {
          vm.user = data.data;
          console.log(vm.user);
          vm.admin = vm.user.admin;
        });
    });
    console.log(vm.user);

    // function to handle login form
    vm.doLogin = function() {
      console.log('starting login');
      vm.processing = true;
      // clear the error
      vm.error = '';
      Auth.login(vm.loginData.username, vm.loginData.password)
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

        });
    };

    // function to handle logging out
    vm.doLogout = function() {
      Auth.logout();
      vm.user = '';

      $location.path('/login');
    };



  });
