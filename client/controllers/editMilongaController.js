myApp.controller('editMilongaController', function($scope, $routeParams, $location, eventsFactory, $rootScope, $window){

	var milongaId = $routeParams.id;
	$scope.performers = [];
	$scope.teachers = [];
	$scope.performersList = [];
	$scope.outputPerformers = [];
	$scope.outputTeachers = [];



	eventsFactory.getMilonga(milongaId, function(data){
		$scope.editMilonga = data.data;
	});
	
	eventsFactory.getPerformers(function(data){
		console.log('performers:',data);
		for ( var i = 0; i < data.length; i++){
			$scope.performers.push({name: data[i].name, _id: data[i]._id})
			$scope.teachers.push({name: data[i].name, _id: data[i]._id})
		}
		console.log($scope.performers);

	})

	$scope.addPerformer = function(){
		$('#exampleModal').modal('hide');
		console.log('ADD PERFORMER CONTROLLER')
		eventsFactory.addPerformer($scope.dancer, function(addedDancer){
			console.log('added dancer', addedDancer)
			$scope.performers.push({name: addedDancer.data.name, _id: addedDancer.data._id});
			$scope.teachers.push({name: addedDancer.data.name, _id: addedDancer.data._id});
		});
	}

	$scope.updateMilonga = function(){
		if(!$rootScope.user){
	 		console.log('!Rosotscope user')
	 		$('#loginModal').modal();
	 	}
	 	else{

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

  	$scope.popup1 = {
    	opened: false
  	};

	$scope.open1 = function() {
    	$scope.popup1.opened = true;
  	};

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


})