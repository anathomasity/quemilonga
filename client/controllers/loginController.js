myApp.controller('loginController', function($scope, eventsFactory, $facebook, $location, $http, $rootScope, $window){

     $scope.$on('fb.auth.authResponseChange', function() {
      $scope.status = $facebook.isConnected();
      if($scope.status) {
        $facebook.api('/me').then(function(user) {
          $rootScope.user = user;
          for(var i = 0; i < $rootScope.user.name.length; i++){
            if($rootScope.user.name[i] == " "){
              $rootScope.user.first_name = $rootScope.user.name.slice(0,i);
              $rootScope.user.last_name = $rootScope.user.name.slice(i+1);
            }
          }
          console.log('rootscope.user: ', $rootScope.user)
          $window.history.back()
        });
      }
    });

    $scope.loginToggle = function() {
      if($scope.status) {
        $facebook.logout();
      } else {
        $facebook.login();
      }
    };

    // $scope.getFriends = function() {
    //   if(!$scope.status) return;
    //   $facebook.cachedApi('/me/friends').then(function(friends) {
    //     $scope.friends = friends.data;
    //   });
    // }

})