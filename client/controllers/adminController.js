myApp.controller('adminController', function($scope, eventsFactory, $location, $http, $rootScope, $facebook){

	if(!$rootScope.user){
 		// console.log('!Rosotscope user')
 		$location.url('/')
 	}
 	else if ($rootScope.user.fb_id != '10210732169205347') {
 		// console.log('Rosotscope userId not compatible')
 		$location.url('/')
 	}
 	else{
		eventsFactory.getPerformers(function(data){
			console.log('Performers:', data)
			$scope.dancers = data;
		})
		eventsFactory.getRequests(function(data){
			console.log('Requests:', data)
			$scope.dancerRequests = data;
		})
		eventsFactory.getAllEvents(function(data){
			console.log('all events:', data)
			$scope.events = data;
		})
		eventsFactory.getLinkingRequests(function(data){
			console.log('Linking requests:', data)
			$scope.linkingRequests = data;
		})


		$scope.addPerformer = function(index){
			// console.log(index);
			// console.log('accepting request!!!');
			var dancer = {
				perfId: $scope.dancerRequests[index]._id,
				pending: false,
			}
			eventsFactory.addPerformer(dancer, function(addedDancer){
				$scope.dancers.push(addedDancer.data);
				eventsFactory.getRequests(function(data){
					$scope.dancerRequests = data;
				})
			});
		}

		$scope.destroyRequest = function(index){
			// console.log('destroying request!!', index);
			var requestId = $scope.dancerRequests[index]._id;
			eventsFactory.destroyRequest(requestId, function(destroyedRequest){
				// console.log(destroyedRequest, 'back at controller');
				$scope.dancerRequests.splice(index, 1);
			})
		}

		var editRequestId;
		$scope.dancer = {};

		$scope.editRequest = function(index){

			// console.log(index)

			editRequestId = $scope.dancerRequests[index]._id;

			// console.log(editRequestId)
			$scope.dancer.name = $scope.dancerRequests[index].name;
			$scope.dancer.from = $scope.dancerRequests[index].from;
			$('#editRequestModal').modal();
		}

		$scope.saveEditRequest = function() {

			var info = $scope.dancer;
			info.requestId = editRequestId;

			eventsFactory.editRequest(info, function(editedRequest){
				// console.log(editedRequest, 'back at controller');
				eventsFactory.getRequests(function(data){
					// console.log('Requests:', data)
					$scope.dancerRequests = data;
					$('#editRequestModal').modal('hide');
					eventsFactory.getPerformers(function(data){
						// console.log('Performers:', data)
						$scope.dancers = data;
					})
				})
			})
		}

		
		$scope.acceptAccountLinking = function(index){

			var requestToAccept = $scope.linkingRequests[index];
			eventsFactory.acceptAccountLinking(requestToAccept, function(result){
				eventsFactory.getPerformers(function(data){
					console.log('Performers:', data)
					$scope.dancers = data;
				})
			})

		}

		$scope.destroyLinkingRequest = function(index){
			// console.log('destroying request!!', index);
			var requestId = $scope.linkingRequests[index]._id;
			eventsFactory.destroyLinkingRequest(requestId, function(destroyedRequest){
				console.log(destroyedRequest, 'destroying this one');
				$scope.linkingRequests.splice(index, 1);
			})
		}



	}//END OF ELSE



});