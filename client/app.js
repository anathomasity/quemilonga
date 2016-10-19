var myApp = angular.module('Myapp', ['ngRoute','ngFacebook', 'ui.bootstrap', 'ngAnimate', 'ngTouch', 'google.places', 'multipleDatePicker', "isteven-multi-select"]);

(function(){
	myApp.controller('MainCtrl', function ($scope, $rootScope, $facebook, eventsFactory, $location) {
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
		          var info = {
		          	first_name: $rootScope.user.first_name,
		          	last_name: $rootScope.user.last_name,
		          	fb_id: $rootScope.user.id
		          }
		          eventsFactory.createUser(info, function(data){
			          console.log('back in frontend controller',data);
			          if(data.data._attending){
			          	$rootScope.user._attending = data.data._attending;
			          }
			          if(data.data._favorites){
			          	$rootScope.user._favorites = data.data._favorites;
			          }
		              console.log('rootscope.user: ', $rootScope.user)

			      });
		        });
		    }
	    });

	    $scope.loginToggle = function() {
	      if($scope.status) {
	        $facebook.logout();
	      } else {
	        $facebook.login();
	        $('#loginModal').modal('hide');
	      }
	    };

	    $scope.login = function(){
	    	$('#loginModal').modal();
	    }
	    $scope.logout = function(){
	    	$rootScope.user = false;
	    	$scope.status = false;
	    	$location.url('/')
	    }

    });
	myApp.config(function($routeProvider){
		$routeProvider
			.when('/', 
			{
				controller: 'indexController',
				templateUrl: "partials/index.html",
			})
			.when('/milongas/new', 
			{
				controller: 'newController',
				templateUrl: "partials/new.html",
				// needAuth: true,
			})
			.when('/milongas/:id/edit', 
			{
				controller: 'editMilongaController', 
				templateUrl: "partials/editMilonga.html",
				// needAuth: true,
			})	
			.when('/performers/:id', 
			{
				controller: 'showController', 
				templateUrl: "partials/show.html"
			})
			.when('/login', 
			{
				controller: 'loginController', 
				templateUrl: "partials/login.html"
			})
			.when('/admin', 
			{
				controller: 'adminController', 
				templateUrl: "partials/admin.html"
			})
			.when('/profile', 
			{
				controller: 'profileController', 
				templateUrl: "partials/profile.html"
			})

	});
	myApp.config(['$facebookProvider', function($facebookProvider) {
    	$facebookProvider.setAppId('241982722868622').setPermissions(['email','public_profile']).setVersion("v2.6");
	}]);
    myApp.run(['$rootScope', '$window', function($rootScope, $window) {
	    (function(d, s, id) {
	      var js, fjs = d.getElementsByTagName(s)[0];
	      if (d.getElementById(id)) return;
	      js = d.createElement(s); js.id = id;
	      js.src = "//connect.facebook.net/en_US/sdk.js";
	      fjs.parentNode.insertBefore(js, fjs);
	    }(document, 'script', 'facebook-jssdk'));
	    $rootScope.$on('fb.load', function() {
	      $window.dispatchEvent(new Event('fb.load'));
	    });
	  }])
}());

