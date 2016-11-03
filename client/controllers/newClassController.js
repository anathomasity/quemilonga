myApp.controller('newClassController', function($scope, eventsFactory, $location, $http, $rootScope, $facebook){

	$scope.event = {};
	$rootScope.teachers = [];
	$scope.event.address = {};
	$scope.performersList = [];
	$scope.toggle;

	// console.log('USER is: ',$rootScope.user);

	eventsFactory.getPerformers(function(dat){
		// console.log('performers:',data);
		for ( var i = 0; i < dat.length; i++){
			if(dat[i].pending && dat[i].pending == true){
				var pending = dat[i].name + ' ' + '(PENDING)';
				$rootScope.teachers.push({name: pending, _id: dat[i]._id})
			}
			else{
				$rootScope.teachers.push({name: dat[i].name, _id: dat[i]._id})
			}
		}

	})

	$scope.addMilonga = function(){

	 	if(!$rootScope.user){
	 		// console.log('!Rosotscope user')
	 		$('#loginModal').modal();
	 	}
	 	else {

	 		if(!$scope.hasStNumber()){
	 			return;
	 		}

	 		if($scope.outputTeachers.length < 1){
	 			return;
	 		}

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

	        

	        // PUSH EACH TEACHER AND EACH PERFORMER TO THE CORRESPONDING EVENT ARRAY
	        // PUSH TEACHERS AND PERFORMERS TO PERFORMERSLIST ARRAY TO EDIT PERFORMER'S PROFILE

			$scope.event._class_teachers = [];
			for (var i in $scope.outputTeachers){
				$scope.event._class_teachers.push($scope.outputTeachers[i]._id)
				$scope.performersList.push({perfId: $scope.outputTeachers[i]._id, action: 'class'});
				
			}

			// CREATE A DUPLICATE EVENT FOR EACH OF THE DATES IN THE ARRAY, WITH ONLY BASIC INFO
	        for (var i = 0; i < $scope.repeatMilonga.length; i++) {

	            var simpleVersion = {
	            	date: $scope.repeatMilonga[i]._d,
	            	start_time: $scope.event.start_time,
	            	end_time: $scope.event.end_time,
	            	class_price: $scope.event.price,
	            	address: $scope.event.address,
	            	details: $scope.event.details,
	            	_class_teachers: $scope.event._class_teachers,
	            	_added_by: $rootScope.user.fb_id,
	        	}

				eventsFactory.addClass(simpleVersion, function(addedClass){
					console.log('CLASS ADDED:', addedClass)

					for (var j = 0; j < $scope.performersList.length; j++){
						var info = {
							performerId: $scope.performersList[j].perfId,
							action: $scope.performersList[j].action,
							class: addedClass._id,
						}
						eventsFactory.addMilongaToPerformer(info, function(result){
							console.log('ADD MILONGA TO PERFORMER RESULT:',result);
						});
					}
				});
	        }

	        // CREATE THE ORIGINAL CLASS WITH ALL THE INFO
			eventsFactory.addClass($scope.event, function(addedClass){

				console.log('ADDED CLASS:', addedClass)
				
				for (var i = 0; i < $scope.performersList.length; i++){
					var info = {
						performerId: $scope.performersList[i].perfId,
						action: $scope.performersList[i].action,
						class: addedClass._id,
					}
					console.log('THIS IS INFO:', info)

					eventsFactory.addClassToPerformer(info, function(result){
						console.log('ADD CLASS TO PERFORMER RESULT:',result);
					});
				}

				$location.url('/');

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

    $scope.hasStNumber = function() {
  		if(!$scope.address || !$scope.address.address_components){
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

  	$scope.setTouch = function(){
  		$scope.touched = true;
  	}

});