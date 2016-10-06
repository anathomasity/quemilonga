myApp.controller('editMilongaController', function($scope, $routeParams, $location, eventsFactory, $rootScope, $window, $facebook){

	var milongaId = $routeParams.id;
	$scope.performers = [];
	$scope.teachers = [];
	$scope.performersList = [];
	$scope.outputPerformers = [];
	$scope.outputTeachers = [];
	$scope.toggle;



	eventsFactory.getMilonga(milongaId, function(data){
		$scope.editMilonga = data.data;
		console.log(data.data)
		$scope.dt = new Date(data.data.date);
		$scope.m_st = new Date(data.data.start_time);
		$scope.m_et = new Date(data.data.end_time);
		$scope.m_cst = new Date(data.data.class_start_time);
		$scope.m_cet = new Date(data.data.class_end_time);

		eventsFactory.getPerformers(function(dat){
			for ( var i = 0; i < dat.length; i++){
				$scope.performers.push({name: dat[i].name, _id: dat[i]._id})
				$scope.teachers.push({name: dat[i].name, _id: dat[i]._id})
			}
			console.log('performers:', $scope.performers);




			// MARK AS TICKED , THE TEACHERS AND PERFORMERS OF THIS EVENT FOR THE MULTIPICKER
			for(var i = 0; i < $scope.performers.length; i++){
				// console.log('all performers in db list', $scope.performers[i].name)
				for (var j = 0; j < data.data._performers.length; j++) {
					// console.log('_perf of this milonga list', data.data._performers[j])
					if(data.data._performers[j] == $scope.performers[i]._id){
						// console.log('ticked performer!', data.data._performers[i], $scope.performers[j]._id )
						$scope.performers[i].ticked = true;
						// console.log($scope.performers);
					}
				}//END OF FOR
			}//END OF FOR
			console.log('all teachers in db list', $scope.teachers)
			for(var i = 0; i < $scope.teachers.length; i++){
				for (var j = 0; j < data.data._class_teachers.length; j++) {
					// console.log('_perf of this milonga list', data.data._performers[j])
					if(data.data._class_teachers[j] == $scope.teachers[i]._id){
						// console.log('ticked teacher!', data.data._class_teachers[j], $scope.teachers[i]._id )
						$scope.teachers[i].ticked = true;
						// console.log($scope.performers);
					}
				}//END OF FOR
			} //END OF FOR

		}) //END OF GET PERFORMERS

	});
	
	

	// ADD A PERFORMER TO THE LIST OF PERFORMERS
	$scope.findMatches = function(){
	 	if(!$rootScope.user){
	 		console.log('!Rosotscope user')
	 		$('#loginModal').modal();
	 	}
	 	else {
			$scope.matches = [];
			for (var i = 0; i < $scope.performers.length; i++){
				if(getEditDistance($scope.dancer.name, $scope.performers[i].name) < 7){
					$scope.matches.push($scope.performers[i])
				}			
			}
		}//END OF ELSE
	}


	$scope.selectMatch = function(match){
		console.log('match:',match);
		for (var i = 0; i < $scope.performers.length; i++){
			if(match._id == $scope.performers[i]._id){
				if ($scope.toggle == 'performers') {
					$scope.performers[i].ticked = true;
				}
				else if ($scope.toggle == 'teachers') {
					$scope.teachers[i].ticked = true;
				}
				
				$('#exampleModal').modal('hide');
				$scope.matches = false;
				$scope.dancer = {};
			}			
		}
	}

	$scope.toggleList = function(list) {
		if (list == 'p') {
			$scope.toggle = 'performers';
		}
		else if (list == 't') {
			$scope.toggle = 'teachers';
		}
	}

	$scope.addPerformer = function(){
		$('#noMatchMessage').html('Thanks! Request succesfully submitted');
		setTimeout(function(){ 
			console.log("Hello"); 
			$('#exampleModal').modal('hide');
		}, 3000);

		var requestData = {
			user: $rootScope.user,
			dancer_name: $scope.dancer.name,
			dancer_from: $scope.dancer.from
		}

		eventsFactory.addPerformerRequest(requestData, function(addedDancer){
			console.log('succesfully requested, CONTROLLER')
		});
	}

	$scope.updateMilonga = function(){
		if(!$rootScope.user){
	 		console.log('!Rosotscope user')
	 		$('#loginModal').modal();
	 	}
	 	else{
	 		$scope.editMilonga.date = $scope.dt;
	 		$scope.editMilonga.start_time = $scope.m_st;
	 		$scope.editMilonga.end_time = $scope.m_et;
	 		$scope.editMilonga.class_start_time = $scope.m_cst;
	 		$scope.editMilonga.class_end_time = $scope.m_cet;


			if($scope.editMilonga._performers){

				for(var i = 0; i < $scope.editMilonga._performers.length; i++){
					var info = {
						milongaId: $scope.editMilonga._id,
						performerId: $scope.editMilonga._performers[i],
					}
					eventsFactory.removeMilongaFromPerformer(info, function(status){
						console.log('REMOVED MILONGA FROM DANCER',status);
					})
				}
			}
			if($scope.editMilonga._class_teachers){

				for(var i = 0; i < $scope.editMilonga._class_teachers.length; i++){
					var info = {
						milongaId: $scope.editMilonga._id,
						performerId: $scope.editMilonga._class_teachers[i],
					}
					eventsFactory.removeMilongaFromPerformer(info, function(status){
						console.log('REMOVED MILONGA FROM DANCER',status);
					})
				}
			}

			if($scope.address){

				for (var i=0; i < $scope.address.address_components.length; i++){

					if ($scope.address.address_components[i].types[0] == 'street_number') {
						$scope.editMilonga.address.st_number = $scope.address.address_components[i].short_name;
					}
					else if ($scope.address.address_components[i].types[0] == 'route') {
						$scope.editMilonga.address.st_name = $scope.address.address_components[i].short_name;
					}
					else if ($scope.address.address_components[i].types[0] == 'locality') {
					    $scope.editMilonga.address.city = $scope.address.address_components[i].long_name;
					}
					else if ($scope.address.address_components[i].types[0] == 'administrative_area_level_1') {
					    $scope.editMilonga.address.state = $scope.address.address_components[i].short_name;
					}
					else if ($scope.address.address_components[i].types[0] == 'country') {
						$scope.editMilonga.address.country = $scope.address.address_components[i].long_name;
					}
					else if ($scope.address.address_components[i].types[0] == 'postal_code') {
						$scope.editMilonga.address.zip_code = $scope.address.address_components[i].long_name;
					}
				}
			    
				$scope.editMilonga.address.coords = { 
			            lat: $scope.address.geometry.location.lat(),
			            lng: $scope.address.geometry.location.lng()
		        };
			}



	        // PUSH EACH TEACHER AND EACH PERFORMER TO THEIR ARRAY
			$scope.editMilonga._performers = [];
			for (var i in $scope.outputPerformers){
				$scope.editMilonga._performers.push($scope.outputPerformers[i]._id)
				$scope.performersList.push({perfId: $scope.outputPerformers[i]._id, action: 'performance'})

			}
			$scope.editMilonga._class_teachers = [];
			for (var i in $scope.outputTeachers){
				$scope.editMilonga._class_teachers.push($scope.outputTeachers[i]._id)
				$scope.performersList.push({perfId: $scope.outputTeachers[i]._id, action: 'class'})
			}
			
			// DELETE DUPLICATES FROM PERFORMERSLIST
			for(var i = 0; i < $scope.performersList.length; i++){
				for (var j = i+1; j < $scope.performersList.length; j++){
					if($scope.performersList[i] == $scope.performersList[j]){
						$scope.performersList[i].action = 'both';
						$scope.performersList.splice(j, 1);
						i--;
						j--;
					}
				}
			}



			// console.log('scope edit milonga', $scope.editMilonga);
			$scope.editMilonga._added_by = $rootScope.user;
			console.log($scope.editMilonga._added_by, 'ADDED BY')
			eventsFactory.updateMilonga($scope.editMilonga, function(updatedMilonga){
				console.log('UPDATED MILONGA:::', updatedMilonga)
				for (var i = 0; i < $scope.performersList.length; i++){
					info = {
						performerId: $scope.performersList[i].perfId,
						action: $scope.performersList[i].action,
						milonga: updatedMilonga._id,
					}
					console.log('THIS IS THE INFO WE ARE PASSING',info);
					eventsFactory.addMilongaToPerformer(info, function(result){
						console.log(result);
						info = {};
					})
				}
				$location.path('/');
			})
		} //END OF ELSE
	}

	$scope.editAddress = function() {
		$scope.addressForm = true;
	}

  	$scope.popup1 = {
    	opened: false
  	};

	$scope.open1 = function() {
    	$scope.popup1.opened = true;
  	};

  	$scope.autocompleteOptions = {
        types: ['address'],
    }

    $scope.options = {
    	showWeeks: false,
  	};

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
        $('#loginModal').modal('hide');
      }
    };

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

})