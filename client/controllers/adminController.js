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

		$scope.exampleModal = function() {
			$('#exampleModal').modal();
		}
	}//END OF ELSE



});