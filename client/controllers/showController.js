// WHEN YOU EDIT AN EVENT, IF YOU REMOVE PERFORMERS FROM A MILONGA THERE IS AN ERROR
//WHEN EDDITING "EVENTS_ATTENDING" ON THAT PERFORMER, BUT IF YOU REMOVE THE TEACHERS, IT EDITS CORRECTLY



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