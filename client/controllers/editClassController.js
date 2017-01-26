myApp.controller('editClassController', function($scope, $routeParams, $location, eventsFactory, $rootScope, $window, $facebook){

	var classId = $routeParams.id;
	$rootScope.teachers = [];
	$scope.performersList = [];
	$scope.outputTeachers = [];
	$scope.toggle;

    $window.scrollTo(0, 0);

    $scope.toggleClass("calendarRow", "findRow", "forumRow");


	eventsFactory.getClass(classId, function(data){
		$scope.editMilonga = data.data;
		// console.log('$scope.editMilonga:', data.data)
		$scope.dt = new Date(data.data.date);
		$scope.m_st = new Date(data.data.start_time);
		$scope.m_et = new Date(data.data.end_time);
		$scope.m_cst = new Date(data.data.class_start_time);
		$scope.m_cet = new Date(data.data.class_end_time);

		eventsFactory.getPerformers(function(dat){
			// console.log('THIS IS DATA FROM GET PERFORMERS:', dat)
			for ( var i = 0; i < dat.length; i++){
				if(dat[i].pending && dat[i].pending == true){
					var pending = dat[i].name + ' ' + '(PENDING)';
					$rootScope.teachers.push({name: pending, _id: dat[i]._id})
				}
				else{
					$rootScope.teachers.push({name: dat[i].name, _id: dat[i]._id})
				}
			}


			// MARK AS TICKED , THE TEACHERS OF THIS EVENT FOR THE MULTIPICKER
			// console.log('all teachers in db list', $rootScope.teachers)
			for(var i = 0; i < $rootScope.teachers.length; i++){
				for (var j = 0; j < data.data._class_teachers.length; j++) {
					// console.log('_teachers of this class list', data.data._class_teachers[j])
					if(data.data._class_teachers[j]._id == $rootScope.teachers[i]._id){
						// console.log('ticked teacher!', data.data._class_teachers[j], $rootScope.teachers[i]._id )
						$rootScope.teachers[i].ticked = true;
						// console.log($rootScope.teachers);
					}
				}//END OF FOR
			} //END OF FOR

		}) //END OF GET PERFORMERS

	});

	$scope.updateMilonga = function(){
		if(!$rootScope.user){
	 		// console.log('!Rosotscope user')
	 		$('#loginModal').modal();
	 	}
	 	else{

	 		if(!$scope.hasStNumber()){
	 			return;
	 		}

	 		//if user didn't input any teachers, don't continue
	 		if($scope.outputTeachers.length < 1){
	 			// console.log('less than 1 teachers, returnin')
	 			return;
	 		}

	 		$scope.editMilonga.date = $scope.dt;
	 		$scope.editMilonga.start_time = $scope.m_st;
	 		$scope.editMilonga.end_time = $scope.m_et;
	 		$scope.editMilonga.class_start_time = $scope.m_cst;
	 		$scope.editMilonga.class_end_time = $scope.m_cet;


	 		//REMOVE CLASS FROM THE PERFORMER
	 		// console.log('EDIT MILONGA CLASS TEACHERS', $scope.editMilonga)
			if($scope.editMilonga._class_teachers){

				for(var i = 0; i < $scope.editMilonga._class_teachers.length; i++){
					var info = {
						classId: $scope.editMilonga._id,
						teacherId: $scope.editMilonga._class_teachers[i]._id,
					}
					// console.log('INFO', info)
					eventsFactory.removeClassFromPerformer(info, function(status){
						// console.log('REMOVED class FROM DANCER',status);
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



	         // PUSH EACH TEACHER TO THE CORRESPONDING EVENT ARRAY
	        // PUSH TEACHERS TO PERFORMERSLIST ARRAY TO EDIT PERFORMER'S PROFILE

			$scope.editMilonga._class_teachers = [];
			for (var i in $scope.outputTeachers){
				$scope.editMilonga._class_teachers.push($scope.outputTeachers[i]._id)
				$scope.performersList.push({perfId: $scope.outputTeachers[i]._id, action: 'class'});
				
			}


			// console.log($rootScope.user);
			// console.log('scope edit milonga', $scope.editMilonga);
			$scope.editMilonga._added_by = {
	        	name: $rootScope.user.first_name + ' ' + $rootScope.user.last_name,
        		id: $rootScope.user.fb_id
	        };
			// console.log($scope.editMilonga._added_by, 'ADDED BY')


			eventsFactory.updateClass($scope.editMilonga, function(updatedClass){
				// console.log('UPDATED CLASS:::', updatedClass)
				for (var i = 0; i < $scope.performersList.length; i++){
					info = {
						performerId: $scope.performersList[i].perfId,
						action: $scope.performersList[i].action,
						class: updatedClass._id,
					}
					// console.log('THIS IS THE INFO WE ARE PASSING',info);
					eventsFactory.addClassToPerformer(info, function(result){

						// console.log("ADDED MILONGA TO PERF: ", result);
						info = {};
					})
				}
				$location.path('/classes/' + updatedClass._id);
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
  		if($scope.address && !$scope.address.address_components){
  			return false;
  		}
  		else if(!$scope.address){
  			return true;
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

})