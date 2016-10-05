myApp.controller('newController', function($scope, eventsFactory, $location, $http, $rootScope, $facebook){

	$scope.event = {};
	$scope.performers = [];
	$scope.teachers = [];
	$scope.event.address = {};
	$scope.performersList = [];

	console.log('USER is: ',$rootScope.user);

	eventsFactory.getPerformers(function(data){
		// console.log('performers:',data);
		for ( var i = 0; i < data.length; i++){
			$scope.performers.push({name: data[i].name, _id: data[i]._id})
			$scope.teachers.push({name: data[i].name, _id: data[i]._id})
		}

	})


	// ADD A PERFORMER TO THE LIST OF PERFORMERS
	$scope.addPerformer = function(){
		$('#exampleModal').modal('hide');
		// console.log('ADD PERFORMER CONTROLLER')
		eventsFactory.addPerformer($scope.dancer, function(addedDancer){
			// console.log('added dancer', addedDancer)
			$scope.performers.push({name: addedDancer.data.name, _id: addedDancer.data._id});
			$scope.teachers.push({name: addedDancer.data.name, _id: addedDancer.data._id});
		});
	}


	$scope.addMilonga = function(){

	 	// if(!$rootScope.user){
	 	// 	console.log('!Rosotscope user')
	 	// 	$('#loginModal').modal();
	 	// }
	 	// else {

		 	console.log('USER is: ',$rootScope.user);

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

	        $scope.event._added_by = $rootScope.user;

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
	            	_added_by: $rootScope.user,
	        	}

				eventsFactory.addMilonga(simpleVersion, function(addedMilonga){
					// console.log('MILOGA ADDED:', addedMilonga)
				});
	        }

	        // PUSH EACH TEACHER AND EACH PERFORMER TO THEIR ARRAY
	        // PUSH TEACHERS AND PERFORMERS TO PERFORMERSLIST ARRAY
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
						i--;
						j--;
					}
				}
			}

	        // CREATE THE ORIGINAL MILONGA WITH ALL THE INFO
			eventsFactory.addMilonga($scope.event, function(addedMilonga){
				// console.log("THIS IS THE PERFORMERSLIST", $scope.performersList)
				// console.log('ADDED MILONGA', addedMilonga);
				
				for (var i = 0; i < $scope.performersList.length; i++){
					var info = {
						performerId: $scope.performersList[i].perfId,
						action: $scope.performersList[i].action,
						milonga: addedMilonga._id,
					}
					// console.log('THIS IS THE INFO WE ARE PASSING',info);
					eventsFactory.addMilongaToPerformer(info, function(result){
						// console.log(result);
					});
				}

				$location.url('/');

			});

		// } //END OF ELSE

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
          // $window.history.back()
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

    $scope.showClass = function(){
    	$('#newClassForm').css('display', 'block');
    }

});