var myApp = angular.module('Myapp', ['ngRoute','ngFacebook', 'ngCookies', 'ui.bootstrap', 'ngAnimate', 'ngTouch', 'google.places', 'multipleDatePicker', "isteven-multi-select"]);

(function(){
	myApp.controller('MainCtrl', function ($scope, $window, $cookies, $rootScope, $facebook, eventsFactory, forumFactory, $location, $route) {
    	
		$rootScope.search={};
		$scope.userCookie = $cookies.getAll();


		if($scope.userCookie.userFbId){
			eventsFactory.getUser($scope.userCookie.userFbId, function(data){
		        // console.log('GOT USER FROM COOKIE', data.data)
		        $rootScope.user = data.data
		    })
		}

		$scope.threads = [];

		forumFactory.getThreads(function(dat){
		    var threads = dat;
		    var totals = [];
		    var numberOfPosts = Math.floor(threads.length/3)
		    for(var i = 0; i < threads.length; i++){
		        totals.push({index: i, total: threads[i].views + threads[i]._comments.length})
		    }
		    totals.sort(compare);
		    if(numberOfPosts < 2){
		    	$scope.threads.push(threads[0])
		    	$scope.threads.push(threads[1])
		    }
		    else{
		    	var highestScores = totals.splice(0,numberOfPosts);
		    	highestScores = shuffle(highestScores);
		    	$scope.threads.push(threads[highestScores[0].index])
		    	$scope.threads.push(threads[highestScores[1].index])
		    }

		})
		
    	$scope.$on('fb.auth.authResponseChange', function() {
		    $scope.status = $facebook.isConnected();
	     	// console.log('$setting status ON FB LOGIN:', $scope.status);

		    if($scope.status) {
		        $facebook.api('/me', {fields: 'id, name, email, picture'}).then(function(user) {
		          	$scope.use = user;
		          	// console.log(user, 'FACEBOOK RESPONSE')
		            for(var i = 0; i < $scope.use.name.length; i++){
		                if($scope.use.name[i] == " "){
		                    $scope.use.first_name = $scope.use.name.slice(0,i);
		                    $scope.use.last_name = $scope.use.name.slice(i+1);
		                }
		            }
		            var info = {
		          		first_name: $scope.use.first_name,
		          		last_name: $scope.use.last_name,
		          		fb_id: $scope.use.id
		          	}

		          	eventsFactory.getUser($scope.use.id, function(data){
				        if(data.data){
				        	// console.log('USER ALREADY EXISTED')
				        	$rootScope.user = data.data;
					        $cookies.put('userFbId', $scope.use.id);
				        	// $scope.loginToggle();
				        }
				        else{
				        	eventsFactory.createUser(info, function(data){
					            // console.log('CREATED A NEW USER',data);
					            $cookies.put('userFbId', $scope.use.id);
					            // $scope.userCookie = $cookies.getAll();
		  						// console.log('AFTER LOGGIN IN:',$scope.userCookie)
					            $rootScope.user = data.data;
				         	    // $scope.loginToggle();
				         	    // console.log('$ROOTSSCOPE.USER:', $rootScope.user);
				        	});
				        }
				    })
		        });
		    }
	    });

	    $scope.loginToggle = function() {
	    	// console.log('inside loginToggle')
		    if($scope.status) {
		        $facebook.logout();
		        $rootScope.user = false;
		    	$cookies.remove('userFbId');
		    	$location.url('/')
		    } else {
		    	// console.log('about to log in')
		        $facebook.login();
		        $('#loginModal').modal('hide');
		    }
	    };

	    $scope.getFriends = function() {
	   		// console.log($scope.status, "$scope.status")
	      if(!$rootScope.user) return;
	      $facebook.cachedApi('/me/friends').then(function(friends) {
	        $scope.friends = friends.data;
	        // console.log($scope.friends);
	      });
	    }

	    $scope.login = function(){
	    	$('#loginModal').modal();
	    }

	    $scope.logout = function(){
	    	$scope.status = false;
	    	$rootScope.user = false;
	    	$facebook.logout();
	    	$cookies.remove('userFbId');
	    	$route.reload();
	    	// $location.url('/')
	    }

		// FIND MATCHES TO HELP FINDING THE TEACHER
		$rootScope.performers = [];
		$rootScope.dancer = {}
		$scope.findMatches = function(type){
			console.log('inside find matches')
		 	$scope.fullname = true;
		 	if(!$rootScope.dancer.name){
		 		console.log("DANCER", $rootScope.dancer)
		 		console.log('inside if')
		 		return
		 	}
			if (type == 1){
				if(!$rootScope.user){
			 		// console.log('!Rosotscope user')
			 		$('#loginModal').modal();
			 	}
			 	var string = $rootScope.dancer.name,
    			substring = ' and ',
    			substring2 = '&';
				if (string.indexOf(substring) !== -1 || string.indexOf(substring2) !== -1) {
		 			console.log('includes 2 performers');
		 			$scope.onlyOneMsg = 'Please submit one request for each performer separately';
		 			return
		 		}
		 		
			}

 			$scope.onlyOneMsg = false;
 			eventsFactory.getPerformers(function(data){
				// console.log('performers:',data);
				$rootScope.performers = data;
				$scope.matches = [];
				for (var i = 0; i < $rootScope.performers.length; i++){
					if(getEditDistance($rootScope.dancer.name, $rootScope.performers[i].name) < 7){
						$scope.matches.push($rootScope.performers[i])
					}			
				}
			})
			console.log($scope.matches)
			
			
		}


		$scope.selectMatch = function(match){
			// console.log('SElECT MATCH match:',match);
			for (var i = 0; i < $rootScope.performers.length; i++){
				if(match._id == $rootScope.performers[i]._id){
					if ($scope.toggle == 'performers') {
						$rootScope.performers[i].ticked = true;
					}
					else if ($scope.toggle == 'teachers') {
						console.log('ticking teacher')
						$rootScope.teachers[i].ticked = true;
					}
					
					$('#exampleModal').modal('hide');
					$scope.matches = false;
					$rootScope.dancer = {};
				}			
			}
		}


		//MAKE A PERFORMER WITH PENDING STATUS
		$scope.addPerformer = function(){

			if(!$rootScope.user){
		 		// console.log('!Rosotscope user')
		 		$('#loginModal').modal();
		 	}
		 	else{


			 	var string = $rootScope.dancer.name,
    			substring = ' and ',
    			substring2 = '&';
				if (string.indexOf(substring) !== -1 || string.indexOf(substring2) !== -1) {
		 			console.log('includes 2 performers');
		 			$scope.onlyOneMsg = 'Please submit one request for each performer separately';
		 			$scope.msg = false;
					$scope.matches = false;
		 			return
		 		}

		 		$scope.onlyOneMsg = false;
		 		$scope.msg = true;
		 		$scope.fullname = false;
				setTimeout(function(){ 
					$('#exampleModal').modal('hide');
					$('#findPerformerModal').modal('hide');
					$scope.msg = false;
				}, 2000);

				var requestData = {
					requested_by: $rootScope.user,
					name: $rootScope.dancer.name,
					from: $rootScope.dancer.from
				}

				eventsFactory.addPerformerRequest(requestData, function(addedDancer){
					// console.log('succesfully requested, CONTROLLER')
					// $rootScope.dancer = false;
					$scope.matches = false;

					var pending = addedDancer.data.name + ' ' + '(PENDING)';
					if($rootScope.teachers){
						$rootScope.teachers.push({name: pending, _id: addedDancer.data._id});
					}
					$rootScope.performers.push({name: pending, _id: addedDancer.data._id});

				});

		 	}
			
		}

		$scope.$watch("dancer.name", function(newValue, oldValue) {
			$scope.matches = false;
		});

		$scope.findPerformerModal = function(){
			$('#findPerformerModal').modal();
		}

		$scope.viewPerformer = function(perfId){
			$location.url('/performers/' + perfId);
			$('#findPerformerModal').modal('hide');
			$rootScope.dancer = {};
			$scope.matches = false;

		}

		var getEditDistance = function(a, b){
		  if(a.length == 0) return b.length; 
		  if(b.length == 0) return a.length; 

		  var matrix = [];

		  // increment along the first column of each row
		  var i;
		  for(i = 0; i <= b.length; i++){
		    matrix[i] = [i];
		  }

		  // increment each column in the first row
		  var j;
		  for(j = 0; j <= a.length; j++){
		    matrix[0][j] = j;
		  }

		  // Fill in the rest of the matrix
		  for(i = 1; i <= b.length; i++){
		    for(j = 1; j <= a.length; j++){
		      if(b.charAt(i-1) == a.charAt(j-1)){
		        matrix[i][j] = matrix[i-1][j-1];
		      } else {
		        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
		                                Math.min(matrix[i][j-1] + 1, // insertion
		                                         matrix[i-1][j] + 1)); // deletion
		      }
		    }
		  }

		  return matrix[b.length][a.length];
		};

		$scope.sendMail = function(emailId,subject,message){
			// console.log('Opening mailto')
		    $window.open("mailto:"+ emailId + "?subject=" + subject+"&body="+message,"_self");
		};

		$scope.openSurvey = function() {
			$window.open("https://goo.gl/forms/89aqNF6Y1ekvfJgj1");
		}

		$scope.closeNav = function(){
			$('.hidden-desktop').click();
		}

		$scope.go = function ( path ) {
			if(path){
		    	$location.path( path );
			}
			else
			{
				$window.history.back();
			}
		};

		$scope.imageModal = function(url){

			$rootScope.url = url;
			$('#imageModal').modal();

		}

		$scope.getAttendees = function(eventId, eventType) {

			var info = {
				eventId : eventId,
				eventType : eventType
			}

			eventsFactory.getAttendees(info, function(data){
				$scope.attendees = data.data;
			})
		}

		  function compare(a,b) {
		    if (a.total < b.total)
		      return 1;
		    if (a.total > b.total)
		      return -1;
		    return 0;
		  }

		  function shuffle(array) {
		    var currentIndex = array.length, temporaryValue, randomIndex;

		    // While there remain elements to shuffle...
		    while (0 !== currentIndex) {

		      // Pick a remaining element...
		      randomIndex = Math.floor(Math.random() * currentIndex);
		      currentIndex -= 1;

		      // And swap it with the current element.
		      temporaryValue = array[currentIndex];
		      array[currentIndex] = array[randomIndex];
		      array[randomIndex] = temporaryValue;
		    }

		    return array;
		  }

		  $scope.openFaceProfile = function(added_by_id) {
		     $window.open('https://www.facebook.com/' + added_by_id, '_blank');
		  };





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
			.when('/performers', 
			{
				controller: 'findPerformerController', 
				templateUrl: "partials/findPerformer.html"
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
			.when('/classes/new', 
			{
				controller: 'newClassController',
				templateUrl: "partials/newClass.html",
				// needAuth: true,
			})
			.when('/classes/:id/edit', 
			{
				controller: 'editClassController', 
				templateUrl: "partials/editClass.html",
				// needAuth: true,
			})
			.when('/classes/:id', 
			{
				controller: 'showClassController',
				templateUrl: "partials/showClass.html",
				// needAuth: true,
			})
			.when('/milongas/:id', 
			{
				controller: 'showMilongaController', 
				templateUrl: "partials/showMilonga.html",
				// needAuth: true,
			})	
			.when('/generalMap', 
			{
				controller: 'generalMapController', 
				templateUrl: "partials/generalMap.html",
				// needAuth: true,
			})
			.when('/forum', 
			{
				controller: 'forumController', 
				templateUrl: "partials/forum.html",
				// needAuth: true,
			})
			.when('/threads/:id', 
			{
				controller: 'threadController', 
				templateUrl: "partials/thread.html",
				// needAuth: true,
			})
			.when('/linkPerfAccount', 
			{
				controller: 'linkPerfAccountController', 
				templateUrl: "partials/linkPerfAccount.html",
				// needAuth: true,
			})		

	});
	myApp.config(['$facebookProvider', function($facebookProvider) {
    	$facebookProvider.setAppId('241982722868622')
    	.setPermissions('email, user_friends, public_profile')
    	.setVersion("v2.8");
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

