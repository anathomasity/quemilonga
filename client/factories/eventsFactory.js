myApp.factory('eventsFactory', function($http){



	var factory = {};

	var performers = [];

	var milongas = [];

	factory.getMilongas = function(info, callback){
			console.log('this is the get milongas AT FACTORY', info);
			$http.post('/milongas/get', info.state).then(function(data){

				for(day in data.data){

					for(var milonga = 0; milonga < data.data[day].length; milonga++){


							// CALCULATE THE DISTANCE BETWEEN THE TWO LAT/LNG POINTS
							var radlat1 = Math.PI * data.data[day][milonga].address.coords.lat/180
							var radlat2 = Math.PI * info.pos.lat/180
							var theta = data.data[day][milonga].address.coords.lng-info.pos.lng
							var radtheta = Math.PI * theta/180
							var result = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
							result = Math.acos(result)
							result = result * 180/Math.PI
							result = result * 60 * 1.1515
							// if (unit=="K") { result = result * 1.609344 }
							// if (unit=="N") { result = result * 0.8684 }

						if(result > info.range){
							console.log('grater than', info.range);
							console.log('IT IS: ', result)
							data.data[day].splice(milonga, 1);
							milonga --;
							// console.log('MILONGA', milonga);
						}
						else{
							console.log('not grater than',info.range);
							console.log('IT IS: ', result)
							console.log('MILONGA', milonga);
						}
					}
				}
				callback(data.data);
			})
		};

	factory.addMilonga = function(data, callback){
		console.log('made it to my Add Milonga in the factory');
		$http.post('/milongas', data).then(function(data){
			console.log('made it back from backend this is our new milonga', data.data);
			// milongas.push(data.data);
			callback(data.data);
		})
	}

	factory.addPerformer = function(data, callback){
		console.log('made it to my Add performer in the factory');
		$http.post('/performers', data).then(function(data){
			console.log('made it back from backend this is our new performer', data);
			callback(data);
		})
	}
	
	factory.getPerformers = function(callback){
		console.log('made it to Get performers factory');
		$http.get('/performers').then(function(performers){
			console.log('made it back from backend with performers', performers);
			performers = performers.data;
			callback(performers);
		})
	}

	factory.getMilonga = function(milongaId, callback){
		$http.get('/milongas/' + milongaId).then(function(milonga){
			console.log('made it back from backend this one milonga', milonga);
			callback(milonga);
		})
	}

	factory.updateMilonga = function(updateMilonga, callback){
		$http.post('/milongas/' + updateMilonga._id + '/update', updateMilonga).then(function(data){
			console.log('updated milonga:', data.data);
			callback(data.data);
		})
	}

	factory.getPerformer = function(performerId, callback){
		$http.get('/performers/' + performerId).then(function(performer){
			console.log('made it back from backend this one performer', performer);
			callback(performer);
		})
	}

	factory.addMilongaToPerformer = function(info, callback){
		$http.post('/performers/' + info.performerId + '/update', info).then(function(performer){
			console.log('made it back from backend eddited this performer', performer);
			callback(performer);
		})
	}

	factory.removeMilongaFromPerformer = function(info, callback){
		console.log('INFO', info)
		$http.post('/performers/' + info.performerId + '/removeMilonga', info).then(function(performer){
			console.log('made it back from backend eddited this performer', performer);
			callback(performer);
		})
	}

	return factory;
})