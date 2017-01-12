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
		// console.log('SORT MILNGAS')
		if(milonga.milonga[0] && milonga.milonga[0].event_type == 'milonga'){
			// console.log('equals to MILONGA')

			var date = new Date(milonga.milonga[0].date);
			return date;
		}
		else if(milonga.class[0] && milonga.class[0].event_type == 'class'){
			// console.log('equals to class')
			var date = new Date(milonga.class[0].date);
			return date;
		}
		
	};
})