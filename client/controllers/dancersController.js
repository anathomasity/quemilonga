myApp.controller('dancersController', function($scope, eventsFactory, $routeParams, forumFactory, $location, $window, $http, $rootScope, $facebook,  $window){

    $window.scrollTo(0, 0);
    $scope.topDancers = [];

    // console.log('USER', $rootScope.user)

    eventsFactory.getPerformers(function(dat){
	    var topDancers = dat;
	    var totals = [];
	    var numberOfPosts = Math.floor(topDancers.length/3)
	    for(var i = 0; i < topDancers.length; i++){
	        totals.push(
        	{   
        		index: i, 
        		total: topDancers[i]._followers.length + topDancers[i]._endorsers.length + topDancers[i]._comments.length + topDancers[i]._favorite_dancers.length
        	})
	    }
	    totals.sort(compare);
	    if(numberOfPosts < 2){
	    	$scope.topDancers.push(topDancers[0])
	    	$scope.topDancers.push(topDancers[1])
	    }
	    else{
	    	var highestScores = totals.splice(0,numberOfPosts);
	    	highestScores = shuffle(highestScores);
	    	for (var i = 0; i < 11; i++) {
	    		$scope.topDancers.push(topDancers[highestScores[i].index])
	    	}
	    	
	    }

	})


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

});