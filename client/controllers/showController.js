myApp.controller('showController', function($scope, $routeParams, eventsFactory){

	$scope.now = moment().add(-1,'days').format();

	var performerId = $routeParams.id;
	eventsFactory.getPerformer(performerId, function(data){
		// console.log('show controller,', data);
		$scope.performer = data.data;
	})

	$scope.sortMilongas = function(milonga){
		var date = new Date(milonga.milonga.date);
		return date;
	};
})