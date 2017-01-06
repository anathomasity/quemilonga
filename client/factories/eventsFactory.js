myApp.factory('eventsFactory', function($http){



	var factory = {};

	var performers = [];

	var milongas = [];

	factory.getMilongas = function(info, callback){
		// console.log('this is the get milongas AT FACTORY', info);


		// DIRTY FIX, HAVE TO SOLVE THIS AFTER SOLVING THE DEFAULT CITY OF THE USER
		if(!info.range){
			info.range = 50;
		}

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
						// console.log('grater than', info.range);
						// console.log('IT IS: ', result)
						data.data[day].splice(milonga, 1);
						milonga --;
						// console.log('MILONGA', milonga);
					}
					else{
						// console.log('not grater than',info.range);
						// console.log('IT IS: ', result)
						// console.log('MILONGA', milonga);
					}
				}
			}
			callback(data.data);
		})
	};

	factory.getClasses = function(info, callback){
		// console.log('this is the get classes AT FACTORY', info);


		// DIRTY FIX, HAVE TO SOLVE THIS AFTER SOLVING THE DEFAULT CITY OF THE USER
		if(!info.range){
			info.range = 50;
		}

		$http.post('/classes/get', info.state).then(function(data){

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
						// console.log('grater than', info.range);
						// console.log('IT IS: ', result)
						data.data[day].splice(milonga, 1);
						milonga --;
						// console.log('MILONGA', milonga);
					}
					else{
						// console.log('not grater than',info.range);
						// console.log('IT IS: ', result)
						// console.log('MILONGA', milonga);
					}
				}
			}
			callback(data.data);
		})
	};

	factory.getClass = function(milongaId, callback){
		$http.get('/classes/' + milongaId).then(function(milonga){
			// console.log('made it back from backend this one milonga', milonga);
			callback(milonga);
		})
	}

	factory.getMilonga = function(milongaId, callback){
		$http.get('/milongas/' + milongaId).then(function(milonga){
			// console.log('made it back from backend this one milonga', milonga);
			callback(milonga);
		})
	}

	
	factory.addMilongaToPerformer = function(info, callback){
		$http.post('/performers/' + info.performerId + '/update', info).then(function(performer){
			// console.log('made it back from backend eddited this performer', performer);
			callback(performer);
		})
	}

	factory.addClassToPerformer = function(info, callback){
		$http.post('/performers/' + info.performerId + '/addClass', info).then(function(performer){
			// console.log('made it back from backend eddited this performer', performer);
			callback(performer);
		})
	}

	factory.addMilonga = function(data, callback){
		// console.log('made it to my Add Milonga in the factory');
		$http.post('/milongas', data).then(function(data){
			// console.log('made it back from backend this is our new milonga', data.data);
			// milongas.push(data.data);
			callback(data.data);
		})
	}

	factory.addClass = function(data, callback){
		// console.log('made it to my Add Milonga in the factory');
		$http.post('/classes', data).then(function(data){
			// console.log('made it back from backend this is our new milonga', data.data);
			// milongas.push(data.data);
			callback(data.data);
		})
	}

	factory.addPerformer = function(data, callback){
		// console.log('made it to my Add performer in the factory', data);
		$http.post('/performers', data).then(function(data){
			// console.log('made it back from backend this is our new performer', data);
			callback(data);
		})
	}

	factory.addPerformerRequest = function(data, callback){
		// console.log('made it to my Add performer in the factory');
		$http.post('/requests', data).then(function(data){
			// console.log('made it back from backend this is our new performer', data);
			callback(data);
		})
	}
	
	factory.getPerformers = function(callback){
		// console.log('made it to Get performers factory');
		$http.get('/performers').then(function(performers){
			// console.log('made it back from backend with performers', performers);
			performers = performers.data;
			callback(performers);
		})
	}

	factory.getRequests = function(callback){
		// console.log('made it to Get performers factory');
		$http.get('/requests').then(function(requests){
			// console.log('made it back from backend with requests', requests);
			requests = requests.data;
			callback(requests);
		})
	}

	factory.destroyRequest = function(requestId, callback){
		// console.log('INFO', info)
		$http.post('/requests/' + requestId + '/destroy').then(function(request){
			// console.log('made it back from backend eddited this performer', performer);
			callback(request);
		})
	}

	factory.getMilonga = function(milongaId, callback){
		$http.get('/milongas/' + milongaId).then(function(milonga){
			// console.log('made it back from backend this one milonga', milonga);
			callback(milonga);
		})
	}

	factory.updateMilonga = function(updateMilonga, callback){
		$http.post('/milongas/' + updateMilonga._id + '/update', updateMilonga).then(function(data){
			// console.log('updated milonga:', data.data);
			callback(data.data);
		})
	}

	factory.updateClass = function(updateMilonga, callback){
		$http.post('/classes/' + updateMilonga._id + '/update', updateMilonga).then(function(data){
			// console.log('updated milonga:', data.data);
			callback(data.data);
		})
	}

	factory.getPerformer = function(performerId, callback){
		$http.get('/performers/' + performerId).then(function(performer){
			// console.log('made it back from backend this one performer', performer);
			callback(performer);
		})
	}

	factory.removeMilongaFromPerformer = function(info, callback){
		// console.log('INFO', info)
		$http.post('/performers/' + info.performerId + '/removeMilonga', info).then(function(performer){
			// console.log('made it back from backend eddited this performer', performer);
			callback(performer);
		})
	}

	factory.removeClassFromPerformer = function(info, callback){
		// console.log('INFO', info)
		$http.post('/performers/' + info.teacherId + '/removeClass', info).then(function(performer){
			// console.log('made it back from backend eddited this performer', performer);
			callback(performer);
		})
	}

	factory.likeEvent = function(info, callback){
		// console.log('at factory', info.fb_id)
		$http.post('/users/' + info.fb_id + '/update', info).then(function(user){
			// console.log('made it back from backend eddited this performer', performer);
			callback(user);
		})
	}

	factory.likeClass = function(info, callback){
		// console.log('at factory', info.fb_id)
		$http.post('/users/' + info.fb_id + '/saveClass', info).then(function(user){
			// console.log('made it back from backend eddited this performer', performer);
			callback(user);
		})
	}

	factory.attendEvent = function(info, callback){
		// console.log('at factory', info.fb_id)
		$http.post('/users/' + info.fb_id + '/attend', info).then(function(user){
			// console.log('made it back from backend eddited this performer', performer);
			callback(user);
		})
	}

	factory.attendClass = function(info, callback){
		// console.log('at factory', info.fb_id)
		$http.post('/users/' + info.fb_id + '/attendClass', info).then(function(user){
			// console.log('made it back from backend eddited this performer', performer);
			callback(user);
		})
	}

	factory.createUser = function(info, callback){
		// console.log('at factory', info)
		$http.post('/users', info).then(function(user){
			callback(user);
		})
	}

	factory.getUser = function(fb_id, callback){
		// console.log('at factory', fb_id)
		$http.get('/users/'+ fb_id).then(function(user){
			// console.log('USER AT FACTORY,', user)
			callback(user);
		})
	}

	factory.stopAttending = function(info, callback){
		// console.log('at factory', info)
		$http.post('/stopAttending', info).then(function(user){
			// console.log('made it back from backend eddited this performer', performer);
			callback(user);
		})
	}

	factory.stopAttendingClass = function(info, callback){
		// console.log('at factory', info)
		$http.post('/stopAttendingClass', info).then(function(user){
			// console.log('made it back from backend eddited this performer', performer);
			callback(user);
		})
	}

	factory.stopSaving = function(info, callback){
		// console.log('at factory', info)
		$http.post('/stopSaving', info).then(function(user){
			// console.log('made it back from backend eddited this performer', performer);
			callback(user);
		})
	}

	factory.stopSavingClass = function(info, callback){
		// console.log('at factory', info)
		$http.post('/stopSavingClass', info).then(function(user){
			// console.log('made it back from backend eddited this performer', performer);
			callback(user);
		})
	}

	factory.updateUsersCity = function(info, callback){
		// console.log('THIS IS INFO, FACTORY', info)
		$http.post('/users/' + info.userId + '/updatecity', info).then(function(data){
			// console.log('updated milonga:', data.data);
			callback(data.data);
		})
	}


	return factory;
})