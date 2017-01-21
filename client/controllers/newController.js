myApp.controller('newController', function($scope, eventsFactory, $location, $http, $rootScope, $facebook, $window){
  	$window.scrollTo(0, 0);

	$scope.event = {};
	$rootScope.performers = [];
	$rootScope.teachers = [];
	$scope.event.address = {};
	$scope.performersList = [];
	$scope.toggle;

	$rootScope.multipleVersions = [];

	// console.log('USER is: ',$rootScope.user);

	eventsFactory.getPerformers(function(dat){
		// console.log('performers:',dat);

		for ( var i = 0; i < dat.length; i++){

			if(dat[i].pending && dat[i].pending == true){
				var pending = dat[i].name + ' ' + '(PENDING)';
				$rootScope.teachers.push({name: pending, _id: dat[i]._id});
				$rootScope.performers.push({name: pending, _id: dat[i]._id});
			}
			else{
				$rootScope.teachers.push({name: dat[i].name, _id: dat[i]._id});
				$rootScope.performers.push({name: dat[i].name, _id: dat[i]._id});
			}
		}
		// console.log($rootScope.teachers, $rootScope.performers)

	})

	$scope.toggleList = function(list) {
		if (list == 'p') {
			$scope.toggle = 'performers';
		}
		else if (list == 't') {
			$scope.toggle = 'teachers';
		}
	}

	$scope.addMilonga = function(){

	 	if(!$rootScope.user){
	 		// console.log('!Rosotscope user')
	 		$('#loginModal').modal();
	 	}
	 	else {

	 		if(!$scope.hasStNumber()){
	 			return;
	 		}

			$scope.performersList = [];
			// MAKE SURE EACH COMPONENT OF THE ADDRESS IS IN THE CORRECT FIELD
			for (var i=0; i < $scope.address.address_components.length; i++){

				if ($scope.address.address_components[i].types[0] == 'street_number') {
					$scope.event.address.st_number = $scope.address.address_components[i].short_name;
				}
				else if ($scope.address.address_components[i].types[0] == 'route') {
					$scope.event.address.st_name = $scope.address.address_components[i].short_name;
				}
				else if ($scope.address.address_components[i].types[0] == 'locality') {
				    $scope.event.address.city = $scope.address.address_components[i].long_name;
				}
				else if ($scope.address.address_components[i].types[0] == 'administrative_area_level_1') {
				    $scope.event.address.state = $scope.address.address_components[i].short_name;
				}
				else if ($scope.address.address_components[i].types[0] == 'country') {
					$scope.event.address.country = $scope.address.address_components[i].long_name;
				}
				else if ($scope.address.address_components[i].types[0] == 'postal_code') {
					$scope.event.address.zip_code = $scope.address.address_components[i].long_name;
				}
			}

		    
			$scope.event.address.coords = { 
		            lat: $scope.address.geometry.location.lat(),
		            lng: $scope.address.geometry.location.lng()
	        };

	        $scope.event._added_by = {
	        	name: $rootScope.user.first_name + ' ' + $rootScope.user.last_name,
        		id: $rootScope.user.fb_id
	        };

	        // IF ANY OF THE DATES IS BEFORE THE ORIGINAL DATE, POP IT OUT OF THE ARRAY
	        for (var i = 0; i < $scope.repeatMilonga.length; i++) {
	        	if ($scope.repeatMilonga[i]._d <= $scope.event.date){
	        		// console.log('less than date!');
	        		$scope.repeatMilonga.splice(i, 1);
	        		i--;
	        	}
	        }

	        // CREATE A DUPLICATE EVENT FOR EACH OF THE DATES IN THE ARRAY, WITH ONLY BASIC INFO
	        for (var i = 0; i < $scope.repeatMilonga.length; i++) {

	            var simpleVersion = {
	            	date: $scope.repeatMilonga[i]._d,
	            	title: $scope.event.title,
	            	start_time: $scope.event.start_time,
	            	end_time: $scope.event.end_time,
	            	price: $scope.event.price,
	            	address: $scope.event.address,
	            	_added_by: $scope.event._added_by
	        	}

				eventsFactory.addMilonga(simpleVersion, function(addedMilonga){
					$rootScope.multipleVersions.push(addedMilonga)
				});
	        }

	        // PUSH EACH TEACHER AND EACH PERFORMER TO THE CORRESPONDING EVENT ARRAY
	        // PUSH TEACHERS AND PERFORMERS TO PERFORMERSLIST ARRAY TO EDIT PERFORMER'S PROFILE
			$scope.event._performers = [];
			for (var i in $scope.outputPerformers){
				$scope.event._performers.push($scope.outputPerformers[i]._id);
				$scope.performersList.push({perfId: $scope.outputPerformers[i]._id, action: 'performance'});
			}

			$scope.event._class_teachers = [];
			for (var i in $scope.outputTeachers){
				$scope.event._class_teachers.push($scope.outputTeachers[i]._id)
				$scope.performersList.push({perfId: $scope.outputTeachers[i]._id, action: 'class'});
				
			}

			// DELETE DUPLICATES FROM PERFORMERSLIST AND CHANGE ACTION TO BOTH
			for(var i = 0; i < $scope.performersList.length; i++){
				for (var j = i+1; j < $scope.performersList.length; j++){
					if($scope.performersList[i].perfId == $scope.performersList[j].perfId){
						$scope.performersList[i].action = 'both';
						$scope.performersList.splice(j, 1);
						j--;
					}
				}
			}


	        // CREATE THE ORIGINAL MILONGA WITH ALL THE INFO
	        // console.log('ABOUT TO ADD :', $scope.event)
			eventsFactory.addMilonga($scope.event, function(addedMilonga){

				// console.log('ADDED MILONGA:', addedMilonga)
				
				for (var i = 0; i < $scope.performersList.length; i++){
					var info = {
						performerId: $scope.performersList[i].perfId,
						action: $scope.performersList[i].action,
						milonga: addedMilonga._id,
					}

					eventsFactory.addMilongaToPerformer(info, function(result){
						// console.log('ADD MILONGA TO PERFORMER RESULT:',result);
					});
				}

				$location.url('/milongas/' + addedMilonga._id);
				

			});

		} //END OF ELSE

	};



  	$scope.popup1 = {
    	opened: false
  	};

	$scope.open1 = function() {
    	$scope.popup1.opened = true;
  	};

  	$scope.datesUntil = moment();
  	$scope.passDate = function() {
  		// console.log('pass date method')
            $scope.datesUntil = moment($scope.event.date).add(1, 'days');  		
  	}

  	$scope.autocompleteOptions = {
        types: ['address'],
    }

    $scope.showClass = function(){
    	$('#newClassForm').css('display', 'block');
    }

    $scope.hasStNumber = function() {
  		if(!$scope.address.address_components){
  			return false;
  		}
    	for(var i = 0; i < $scope.address.address_components.length; i++){
    		if ($scope.address.address_components[i].types[0] == 'street_number') {
    			// console.log('returning true')
    			return true;
    		}
    	}
    	// console.log('returning false')
    	return false;
  	};


});