// WHEN YOU EDIT AN EVENT, IF YOU REMOVE PERFORMERS FROM A MILONGA THERE IS AN ERROR
//WHEN EDDITING "EVENTS_ATTENDING" ON THAT PERFORMER, BUT IF YOU REMOVE THE TEACHERS, IT EDITS CORRECTLY



myApp.controller('showController', function($scope, $rootScope, $sce, $routeParams, eventsFactory, $window){

	$scope.now = moment().add(-1,'days').format();
	$rootScope.teachers = [];
	$rootScope.performers = [];
	$scope.toggle;
	$scope.editPerformer = {};
    $window.scrollTo(0, 0);


	var performerId = $routeParams.id;
	eventsFactory.getPerformer(performerId, function(data){
		// console.log(data.data)
		$scope.performer = data.data;

		$scope.futureDates = futureDates();
		

		if($scope.performer.youtubeLink){
			var videoID = '';
			for (var i = $scope.performer.youtubeLink.length - 1; i > 0; i--) {
				if($scope.performer.youtubeLink[i] == '/' || $scope.performer.youtubeLink[i] == '='){
					break;
				}
				videoID = $scope.performer.youtubeLink[i] + videoID;
				// console.log(videoID)

			}
			$scope.youtubeURL = 'https://www.youtube.com/embed/' + videoID;
		}
		
	})

	$scope.trustSrc = function(src) {
	    return $sce.trustAsResourceUrl(src);
	}


	eventsFactory.getPerformers(function(dat){
		// console.log('performers:',data);
		for ( var i = 0; i < dat.length; i++){
			$rootScope.teachers.push({name: dat[i].name, _id: dat[i]._id})
			$rootScope.performers.push({name: dat[i].name, _id: dat[i]._id})
		}

	})

	var today = moment().startOf('day').format();


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

	$scope.editMyProfile = function(){
		$('#editMyProfileModal').modal();
	}

	$scope.updateMyProfile = function(){

		var info = {
			from: $scope.editPerformer.from,
			performerId: performerId,
			youtubeLink : $scope.editPerformer.youtubeLink,
			introduction: $scope.editPerformer.introduction,
			_partner: $scope.partner,
			_favorite_dancers: $scope.favoriteDancers,
		}

		console.log(info)
		eventsFactory.updateMyProfile(info, function(updatedProfile){
			eventsFactory.getPerformer(performerId, function(data){
				$scope.performer = data.data;
				if($scope.performer.youtubeLink){
					var videoID = '';
					for (var i = $scope.performer.youtubeLink.length - 1; i > 0; i--) {
						if($scope.performer.youtubeLink[i] == '/' || $scope.performer.youtubeLink[i] == '='){
							break;
						}
						videoID = $scope.performer.youtubeLink[i] + videoID;
						// console.log(videoID)

					}
					$scope.youtubeURL = 'https://www.youtube.com/embed/' + videoID;
				}
			})
			$('#editMyProfileModal').modal('hide');

		})
	}





	$scope.toggleList = function(list) {
		if (list == 'p') {
			$scope.toggle = 'teachers';
		}
		else if (list == 'fd') {
			$scope.toggle = 'performers';
		}
	}

	function futureDates(){
		for(var i = 0; i < $scope.performer._milongas_attending.length; i++){
			if($scope.performer._milongas_attending[i].milonga[0]){
				// console.log('COMPARING', $scope.performer._milongas_attending[i].milonga[0].date, today)

				if ($scope.performer._milongas_attending[i].milonga[0].date >= today ) {
					// console.log('returning true')
					return true;

				}
			}
			else if ($scope.performer._milongas_attending[i].class[0]) {
				// console.log('COMPARING', $scope.performer._milongas_attending[i].class[0].date, today)
				if ($scope.performer._milongas_attending[i].class[0].date >= today ) {
					// console.log('returning true')

					return true;
				}
			}

			
		}
					// console.log('returning false')

		return false;
	}

	function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 1,
          center: {lat: 0, lng: 0},
          mapTypeId: 'terrain'
        });

        // Define a symbol using SVG path notation, with an opacity of 1.
        var lineSymbol = {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          scale: 4
        };

        // Create the polyline, passing the symbol in the 'icons' property.
        // Give the line an opacity of 0.
        // Repeat the symbol at intervals of 20 pixels to create the dashed effect.
        var line = new google.maps.Polyline({
          path: [{lat: 22.291, lng: 153.027}, {lat: 41.8781, lng: -87.6298}, {lat:35.6895, lng: 139.6917}],
          strokeOpacity: 0,
          icons: [{
            icon: lineSymbol,
            offset: '0',
            repeat: '20px'
          }],
          map: map
        });
      }
	
	// setTimeout(function(){
	// 	initMap();
	// }, 50)



})