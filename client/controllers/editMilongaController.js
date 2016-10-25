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
		// console.log(data.data)
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
			// console.log('performers:', $scope.performers);




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
			// console.log('all teachers in db list', $scope.teachers)
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

	$scope.toggleList = function(list) {
		if (list == 'p') {
			$scope.toggle = 'performers';
		}
		else if (list == 't') {
			$scope.toggle = 'teachers';
		}
	}

	$scope.updateMilonga = function(){
		if(!$rootScope.user){
	 		// console.log('!Rosotscope user')
	 		$('#loginModal').modal();
	 	}
	 	else{

	 		if(!$scope.hasStNumber()){
	 			return;
	 		}

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
						// console.log('REMOVED MILONGA FROM DANCER',status);
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
						// console.log('REMOVED MILONGA FROM DANCER',status);
					})
				}
			}

			if($scope.address && $scope.address.address_components){

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
			$scope.editMilonga._added_by = {
	        	name: $rootScope.user.first_name + ' ' + $rootScope.user.last_name,
        		id: $rootScope.user.fb_id
	        };
			// console.log($scope.editMilonga._added_by, 'ADDED BY')
			eventsFactory.updateMilonga($scope.editMilonga, function(updatedMilonga){
				// console.log('UPDATED MILONGA:::', updatedMilonga)
				for (var i = 0; i < $scope.performersList.length; i++){
					info = {
						performerId: $scope.performersList[i].perfId,
						action: $scope.performersList[i].action,
						milonga: updatedMilonga._id,
					}
					// console.log('THIS IS THE INFO WE ARE PASSING',info);
					eventsFactory.addMilongaToPerformer(info, function(result){
						// console.log(result);
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

})