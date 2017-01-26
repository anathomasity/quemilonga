myApp.controller('showController', function($scope, $rootScope, $http, $sce, $routeParams, eventsFactory, forumFactory, $window, $route){

	$scope.now = moment().add(-1,'days').format();
	$rootScope.teachers = [];
	$rootScope.performers = [];
	$scope.comment = {};
	$scope.toggle;
	$scope.editPerformer = {};
	var following = false;
    var endorsing = false;
    $window.scrollTo(0, 0);
	var performerId = $routeParams.id;




	eventsFactory.getPerformer(performerId, function(data){
		// console.log('PERFORMER:',data.data)
		$scope.performer = data.data;
		checkFollowAndEndorse();

		$scope.futureDates = futureDates();
		

		if($scope.performer.youtubeLink){
			var videoID = '';
			for (var i = $scope.performer.youtubeLink.length - 1; i > 0; i--) {
				if($scope.performer.youtubeLink[i] == '/' || $scope.performer.youtubeLink[i] == '='){
					break;
				}
				videoID = $scope.performer.youtubeLink[i] + videoID;
				// console.log(videoID)

			}
			$scope.youtubeURL = 'https://www.youtube.com/embed/' + videoID;
		}

		// if($scope.performer.destinations.length > 1){
			initMap($scope.performer.destinations);
		// }

		checkCommentVideos();

		
		
	})

	$scope.trustSrc = function(src) {
	    return $sce.trustAsResourceUrl(src);
	}


	eventsFactory.getPerformers(function(dat){
		// console.log('performers:',data);
		for ( var i = 0; i < dat.length; i++){
			$rootScope.teachers.push({name: dat[i].name, _id: dat[i]._id})
			$rootScope.performers.push({name: dat[i].name, _id: dat[i]._id})
		}

	})

	var today = moment().startOf('day').format();


	$scope.sortMilongas = function(milonga){
		// console.log('SORT MILNGAS')
		if(milonga.milonga[0] && milonga.milonga[0].event_type == 'milonga'){
			// console.log('equals to MILONGA')

			var date = new Date(milonga.milonga[0].date);
			return date;
		}
		else if(milonga.class[0] && milonga.class[0].event_type == 'class'){
			// console.log('equals to class')
			var date = new Date(milonga.class[0].date);
			return date;
		}
		
	};

	$scope.editMyProfile = function(){
		$('#editMyProfileModal').modal();
	}

	$scope.updateMyProfile = function(){

		var info = {
			from: $scope.editPerformer.from,
			performerId: performerId,
			youtubeLink : $scope.editPerformer.youtubeLink,
			introduction: $scope.editPerformer.introduction,
			_partner: $scope.partner,
			_favorite_dancers: $scope.favoriteDancers,
		}

		// console.log(info)
		eventsFactory.updateMyProfile(info, function(updatedProfile){
			eventsFactory.getPerformer(performerId, function(data){
				$scope.performer = data.data;
				if($scope.performer.youtubeLink){
					var videoID = '';
					for (var i = $scope.performer.youtubeLink.length - 1; i > 0; i--) {
						if($scope.performer.youtubeLink[i] == '/' || $scope.performer.youtubeLink[i] == '='){
							break;
						}
						videoID = $scope.performer.youtubeLink[i] + videoID;
						// console.log(videoID)

					}
					$scope.youtubeURL = 'https://www.youtube.com/embed/' + videoID;
				}
			})
			$('#editMyProfileModal').modal('hide');

		})
	}





	$scope.toggleList = function(list) {
		if (list == 'p') {
			$scope.toggle = 'teachers';
		}
		else if (list == 'fd') {
			$scope.toggle = 'performers';
		}
	}

	function futureDates(){
		for(var i = 0; i < $scope.performer._milongas_attending.length; i++){
			if($scope.performer._milongas_attending[i].milonga[0]){
				// console.log('COMPARING', $scope.performer._milongas_attending[i].milonga[0].date, today)

				if ($scope.performer._milongas_attending[i].milonga[0].date >= today ) {
					// console.log('returning true')
					return true;

				}
			}
			else if ($scope.performer._milongas_attending[i].class[0]) {
				// console.log('COMPARING', $scope.performer._milongas_attending[i].class[0].date, today)
				if ($scope.performer._milongas_attending[i].class[0].date >= today ) {
					// console.log('returning true')

					return true;
				}
			}

			
		}

		return false;
	}
	


	function initMap(destinations) {
		// console.log(destinations, "DESTINATIONS")
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 1,
          center: {lat: 20, lng: 15},
          mapTypeId: 'terrain'
        });

        
        var myPlan = new google.maps.Polyline({
          path: destinations,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        var infowindow = new google.maps.InfoWindow;

        var marker, i;

		for (i = 0; i < destinations.length; i++) {  
		    marker = new google.maps.Marker({
		         position: new google.maps.LatLng(destinations[i].lat, destinations[i].lng),
		         map: map
		    });

		    google.maps.event.addListener(marker, 'click', (function(marker, i) {
		         return function() {
		             infowindow.setContent("<p><strong>" + destinations[i].city + "</strong><br />"
              		+ destinations[i].start_date + " - " + destinations[i].end_date + "</p>");
		             infowindow.open(map, marker);
		         }
		    })(marker, i));
		}

        myPlan.setMap(map);
    }

  	

	$scope.addComment = function(file){

		// if($scope.file && $scope.file.size > 400000) {
		//   $scope.imgTooBig = 'Sorry, image size must be under 400KB';
		//   return;
		// }

        if($scope.form2.$valid == false) {
            return;
        }

        if(!$rootScope.user){
            // console.log('!Rosotscope user')
            $('#loginModal').modal();
        }
        else {

        	if(file){

        		$rootScope.uploadFiles(file, 'comment', '123123123')
        	}




            $scope.comment._user = $rootScope.user._id;
            $scope.comment.type = 'performer';
            $scope.comment.performerId = $scope.performer._id;



            // $scope.comment.imageLink = 'ADD LINK HERE';
            // console.log("comment TO ADD", $scope.comment)
            // forumFactory.addComment($scope.comment, function(addedComment){
            //     // console.log("ADDED Comment", addedComment)
            //     $scope.comment = {};
            //     eventsFactory.getPerformer(performerId, function(data){
            //         $scope.performer = data.data;
            //         checkCommentVideos();
            //     })
                

            // });

        } //END OF ELSE

    };


 //    $scope.uploadFile = function(file) {

 //    	var fd = new FormData();

	// 	fd.append( 'file', file );
	//     $http.post('/uploadImage', fd).then(function(da){
	// 		console.log("BACK FROM BACKEND DATA:", da);
	// 	})

	// };

    $scope.destroyComment = function(cId){
        forumFactory.destroyComment(cId, function(destroyedComment){
            eventsFactory.getPerformer(performerId, function(data){
                $scope.performer = data.data;
                checkCommentVideos();
            })
        })
    }

    $scope.followOrEndorse = function(type){

    	if(!$rootScope.user){
	 		// console.log('!Rosotscope user')
	 		$('#loginModal').modal();
	 		return
	 	}


    	var info = {
    		type: type,
    		follower: $rootScope.user._id,
    		followed: performerId,
    	}

    	if(type == 'follow') {
    		if(following == true){
    			eventsFactory.stopFollowOrEndorse(info, function(data){
		            // console.log('data.performer',data.performer);
		            $scope.performer._followers = data.performer._followers;
		            following = false;
		            $('#followBtn').css({"box-shadow" : "none"});
    				$('#followBtn').html('Follow');
    			})
    		}
    		else{
    			eventsFactory.followOrEndorse(info, function(data){
		            $scope.performer._followers = data.performer._followers;
		            // console.log('data.performer',data.performer);
		            following = true;
		            $('#followBtn').css({"box-shadow" : "inset .2em .2em .1em #888888"});
    				$('#followBtn').html('Following');

		            
		        })
    		}
    	}
    	else if(type == 'endorse') {
    		if(endorsing == true){
    			eventsFactory.stopFollowOrEndorse(info, function(data){
		            // console.log('data.performer',data.performer);
		            
		            $scope.performer._endorsers = data.performer._endorsers;
		            endorsing = false;
		            $('#endorseBtn').css({"box-shadow" : "none"});
    				$('#endorseBtn').html('Endorse');

    			})
    		}
    		else{
    			eventsFactory.followOrEndorse(info, function(data){
		            endorsing = true;
		            $scope.performer._endorsers = data.performer._endorsers;
		            $('#endorseBtn').css({"box-shadow" : "inset .2em .2em .1em #888888"});
    				$('#endorseBtn').html('Endorsed');

		        })
    		}
    	}


    	

    }

    
    function checkFollowAndEndorse () {
    	if($rootScope.user){
    		for (var i = 0; i < $scope.performer._followers.length; i++){
	    		if($scope.performer._followers[i] == $rootScope.user._id){
	    			// console.log('inside if 1')
	    			$('#followBtn').css({"box-shadow" : "inset .2em .2em .1em #888888", 'border': 'none'});
	    			$('#followBtn').html('Following');
	    			following = true;

	    		}
	    	}
	    	for (var i = 0; i < $scope.performer._endorsers.length; i++){
	    		if ($scope.performer._endorsers[i] == $rootScope.user._id) {
	    			// console.log('inside if 2')
	    			$('#endorseBtn').css({"box-shadow" : "inset .2em .2em .1em #888888", 'border': 'none'});
					$('#endorseBtn').html('Endorsed');
	    			endorsing = true;

	    		}
	    	}
    	}
    	
    }

    $scope.addVideo = function(){
    	$('#addVideo').css('display', 'block');
    }


    function checkCommentVideos(){

		if($scope.performer._comments){
			for (var i = 0; i < $scope.performer._comments.length; i++) {
				if ($scope.performer._comments[i].youtubeLink) {
					// console.log('COMMENT HAS A VIDEO')

					var videoID = '';
					for (var k = $scope.performer._comments[i].youtubeLink.length - 1; k > 0; k--) {
						if($scope.performer._comments[i].youtubeLink[k] == '/' || $scope.performer._comments[i].youtubeLink[k] == '='){
							break;
						}
						videoID = $scope.performer._comments[i].youtubeLink[k] + videoID;
						// console.log(videoID)

					}
					$scope.performer._comments[i].youtubeURL = 'https://www.youtube.com/embed/' + videoID;
					// console.log('NEW VIDEO ADDED', $scope.performer._comments[i])
				}
				
			}
		}


    }


    $rootScope.$watch("user", function(newValue, oldValue) {
    	if(oldValue != newValue){
			$route.reload();

    	} 
	});

	$scope.editPlan = function(){
		$('#editPlan').modal();
	}

	$scope.autocompleteOptions = {
	    types: ['(cities)'],
	  }

	$scope.plan = [];
	$scope.popup1 = [{opened: false}, {opened: false}];
	$scope.popup2 = [{opened: false}, {opened: false}];

	$scope.open1 = function(index) {
		// console.log('INDEX', index)
    	$scope.popup1[index].opened = true;
  	};

	$scope.open2 = function(index) {
    	$scope.popup2[index].opened = true;
  	};

  	$scope.planCities = [{
	  		city: {}, 
	  		start_date: '', 
	  		end_date: '',
	  	}, {
	  		city: {}, 
	  		start_date: '', 
	  		end_date: '',
  	}];

  	$scope.addCampus = function(){
  		$scope.planCities.push({
	  		city: {}, 
	  		start_date: '', 
	  		end_date: '',
	  	});	

	  	$scope.popup1.push({opened: false});
	  	$scope.popup2.push({opened: false});

  	}
  	$scope.removeCampus = function(){
  		$scope.planCities.pop();

	  	$scope.popup1.pop();
	  	$scope.popup2.pop();

  	}

  	var destinations = [];


  	$scope.savePlan = function(){
  		// console.log($scope.plan)


  		for (var i = 0; i < $scope.plan.length; i++) {
  			var start = moment($scope.plan[i].start_date).format("MMM Do YY");
  			var end = moment($scope.plan[i].end_date).format("MMM Do YY");

  			destinations.push({
  				city: $scope.plan[i].city.formatted_address, 
  				lat: $scope.plan[i].city.geometry.location.lat(), 
  				lng: $scope.plan[i].city.geometry.location.lng(),
  				start_date: start,
  				end_date: end,
  			})
  		}
		$('#editPlan').modal('hide');

  		initMap(destinations);

  		var info = {
			destinations: destinations,
			performerId: performerId,
		}

		// console.log(info)
		eventsFactory.updateMyProfile(info, function(updatedProfile){
			
			// console.log(updatedProfile);
		})


  	}

  	var toggle = 'closed';
  	$scope.seeMySchedule = function(){
  		// console.log('inside see my schedule')
  		if(toggle == 'closed'){
			$('#seeMyUpcoming').html('SEE MY UPCOMING EVENTS ▼')
			toggle = 'opened'
		}
		else if(toggle == 'opened'){
			$('#seeMyUpcoming').html('SEE MY UPCOMING EVENTS ▲')
			toggle = 'closed'
		}
  		$( "#schedule" ).slideToggle( "slow", function() {

  			

	  	});
  	}







})