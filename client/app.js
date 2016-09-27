var myApp = angular.module('Myapp', ['ngRoute','ngFacebook', 'uiGmapgoogle-maps', 'ui.bootstrap', 'ngAnimate', 'ngTouch', 'google.places', 'multipleDatePicker', "isteven-multi-select"]);

(function(){
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

