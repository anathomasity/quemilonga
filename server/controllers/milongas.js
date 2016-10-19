var mongoose = require('mongoose');
var Performer = mongoose.model('performer');
var Milonga = mongoose.model('milonga');
var Request = mongoose.model('request');
var User = mongoose.model('user');
var moment = require('moment');

module.exports = (function() {
	return {
		getPerformers: function(req, res){
			Performer.find({}, function(err, performers){
				if(err){
					console.log(err);
					console.log('error finding performers, milongas controller');
				} else {
					res.json(performers);
				}
			})
		},
		createMilonga: function(req, res){
			console.log(req.body, 'THIS IS REQ BODY');
			milonga = new Milonga(req.body);
			milonga.save(function(err, result){
				if(err){
					console.log(err);
					console.log('error creating a new milonga');
				} else {
					console.log('this is our new milonga',result);
					res.json(result);

				}
			})
		},
		getMilongas: function(req, res){

			console.log('GET MILONGAS STATE:', req.body);
			Milonga.find({"address.state" : req.body.state})
			.populate('_performers')
			.populate('_class_teachers')
			.exec(function(err, milongas){
				if(err){
					console.log(err);
					console.log('error finding milongas, milongas controller');
				} else {
					// console.log('THIS ARE THE MILONGAS:', milongas);
					milongas_per_day = {
						today: [],
						tomorrow: [],
						day_after: [], 
					}
					// console.log(new Date())
					for(var m in milongas){


						// IF THE USER SPECIFIED A DATE, USE THAT TO DIVIDE MILONGAS, ELSE USE TODAYS DATE
						var m_date = moment(milongas[m].date).format('YYYY MM DD');

						if(!req.body.date){

							if(m_date == moment(new Date()).format('YYYY MM DD')){
								milongas_per_day.today.push(milongas[m]);
							}

							else if(m_date == moment(new Date()).add(1, 'days').format('YYYY MM DD')){
								milongas_per_day.tomorrow.push(milongas[m]);
							}

							else if(m_date == moment(new Date()).add(2, 'days').format('YYYY MM DD')){
								milongas_per_day.day_after.push(milongas[m]);
							}
						}

						else{

							if(m_date == moment(req.body.date).format('YYYY MM DD')){
								milongas_per_day.today.push(milongas[m]);
							}

							else if(m_date == moment(req.body.date).add(1, 'days').format('YYYY MM DD')){
								milongas_per_day.tomorrow.push(milongas[m]);
							}

							else if(m_date == moment(req.body.date).add(2, 'days').format('YYYY MM DD')){
								milongas_per_day.day_after.push(milongas[m]);
							}

						}
						
						console.log(milongas_per_day);
					}

					res.json(milongas_per_day);
					milongas_per_day = {
						today: [],
						tomorrow: [],
						day_after: [], 
					}
				}
			})
		},
		getMilonga: function(req, res){
			Milonga.findOne({_id: req.params.id}, function(err, result){
				if(err){
					console.log("error finding the milonga", err);
				} else {
					console.log('this is our milonga',result);
					res.json(result);
				}
			})
		},
		updateMilonga: function(req, res){
			// HERE MAKE SURE WE SEND BACK IN RES.JSON THE UPDATED MILONGA
			// Milonga.update({_id: req.params.id}, req.body, function (err, result) {
  	// 			if(err){
			// 		console.log('couldnt save update mongoose', err);
			// 	} else {
			// 		console.log('updated milonga: ', result);
			// 		res.json(result);
			// 	}
			// });
			Milonga.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, result){
			    if(err){
			        console.log("Something wrong when updating milonga!");
			    } else {
					console.log('updated milonga: ', result);
					res.json(result);
				}
			});

		},
		createPerformer: function(req, res){
			console.log(req.body, 'THIS IS REQ BODY');
			performer = new Performer(req.body);
			performer.save(function(err, result){
				if(err){
					console.log(err);
					console.log('error creating a new performer');
				} else {
					console.log('this is our new performer',result);
					res.json(result);

				}
			})
		},
		getPerformer: function(req, res){

			Performer.findOne({_id: req.params.id})
			.populate('_milongas_attending.milonga')
			.exec(function (err, milonga) {
			  if(err){
					console.log("error finding the performer", err);
				} else {
					console.log('this is our performer',milonga);
					res.json(milonga);
				}
			});
		},
		createRequest: function(req, res){
			console.log(req.body, 'THIS IS REQ BODY');
			request = new Request(req.body);
			request.save(function(err, result){
				if(err){
					console.log(err);
					console.log('error creating a new request');
				} else {
					console.log('this is our new request',result);
					res.json(result);

				}
			})
		},
		getRequests: function(req, res){
			Request.find({}, function(err, requests){
				if(err){
					console.log(err);
					console.log('error finding requests, milongas controller');
				} else {
					res.json(requests);
				}
			})
		},
		destroyRequest: function(req, res){
			Request.findByIdAndRemove(req.params.id, function(err){
				if(err){
					console.log('error removing request')
				}
				else{
					res.json({status:'ok'})
				}

			})
		},
		addMilongaToPerformer: function(req, res){

			Performer.findOne({_id: req.params.id}, function (err, performer){
				console.log('GOT TO THE BACKEND CONTROLLER', req.body)
				performer._milongas_attending.push({milonga: req.body.milonga, action: req.body.action});
				console.log('THIS IS THE PERFORMER',performer);
			    performer.save(function (err) {
			        if(err) {
			            console.error('ERROR ADDING EVENT TO PERFORMER!');
			        }
			    });
			});

		},

		removeMilongaFromPerformer: function(req, res){

			Performer.findOne({_id: req.params.id}, function (err, performer){
				console.log('GOT TO THE BACKEND CONTROLLER', req.body)

				var searchTerm = req.body.milongaId;
				var index = -1;
				console.log('before splice:', performer._milongas_attending)
				console.log('performer', performer);
				for(var i = 0; i < performer._milongas_attending.length; i++) {
				    if (performer._milongas_attending[i].milonga == searchTerm) {
				    	console.log('INSIDE IF')
				        index = i;
				        console.log('INDEX:',index)
				        break;
				    }
				}

				performer._milongas_attending.splice(index, 1);
				console.log('after splice:', performer._milongas_attending)
			    performer.save(function (err) {
			        if(err) {
			            console.error('ERROR removing EVENT from PERFORMER!');
			        }
			        else{
			        	res.json({status: 'ok'})
			        }
			    });
			});

		},

		createUser: function(req, res){
			console.log(req.body, 'THIS IS REQ BODY');
			user = new User(req.body);
			user.save(function(err, result){
				if(err){
					console.log(err, 'error creating a new user');
					User.findOne({fb_id: req.body.fb_id})
					.populate('_favorites')
					.populate('_attending')
					.exec(function (erro, user) {
					  if(erro){
							console.log("error finding the User", erro);
						} else {
							console.log('this is our User',user);
							res.json(user);
						}
					});
				} else {
					console.log('this is our new user',result);
					res.json(result);

				};
			});
		},

		getUser: function(req, res){

			User.findOne({fb_id: req.params.id})
			.populate({ 
			     path: '_favorites',
			     populate: {
			       path: '_performers',
			       model: 'performer'
			    } 
			})
			.populate({ 
			     path: '_favorites',
			     populate: {
			       path: '_class_teachers',
			       model: 'performer'
			    } 
			})
			.populate({ 
			     path: '_attending',
			     populate: {
			       path: '_performers',
			       model: 'performer'
			    } 
			}) 
			.populate({ 
			     path: '_attending',
			     populate: {
			       path: '_class_teachers',
			       model: 'performer'
			    } 
			}) 
			.exec(function (err, user) {
			  if(err){
					console.log("error finding the User", err);
				} else {
					console.log('this is our User',user);
					res.json(user);
				}
			});
		},

		likeEvent: function(req, res){

			User.findOne({fb_id: req.params.id}, function (err, user){
				console.log('GOT TO THE BACKEND CONTROLLER', req.body)
				var check = false;
				for(var i = 0; i < user._favorites.length; i++){
					if(user._favorites[i] == req.body.eventId){
						check = true;
					}
				}
				if(check == false) {
					user._favorites.push(req.body.eventId);
					console.log('THIS IS THE user',user);
				    user.save(function (erro) {
				        if(erro) {
				            console.error('ERROR ADDING EVENT TO user!', erro);
				        }
				        else{
				        	res.json({status:'ok!'});
				        };
				    });
				}
				else{
					console.log('EVENT ALREADY SAVED');
				}
			});
		},

		attendEvent: function(req, res){

			User.findOne({fb_id: req.params.id}, function (err, user){
				console.log('GOT TO THE BACKEND CONTROLLER', req.body)
				var check = false;
				for(var i = 0; i < user._attending.length; i++){
					if(user._attending[i] == req.body.eventId){
						check = true;
					}
				}
				if(check == false) {
					user._attending.push(req.body.eventId);
					console.log('THIS IS THE user',user);
				    user.save(function (erro) {
				        if(erro) {
				            console.error('ERROR ADDING EVENT TO user!', erro);
				        }
				        else{
				        	res.json({status:'ok!'});
				        };
				    });
				}
				else{
					console.log('ALREADY ATTENDING THIS EVENT');
				}
			});
		},
		stopAttending: function(req,res){
			User.findOne({fb_id: req.body.userId}, function(err, user){
				if(err){
					console.log("error finding the user", err);
				}
				else {
					// console.log('this is our user',user);
					var index = user._attending.indexOf(req.body.eventId);
					user._attending.splice(index, 1);
					user.save(function(erro, use) {
						if (erro) {
							console.log('ERROR', erro)
						}
						else{
							res.json(user);
						}
					})
				}
			})
		},
		stopSaving: function(req,res){
			User.findOne({fb_id: req.body.userId}, function(err, user){
				if(err){
					console.log("error finding the user", err);
				}
				else {
					// console.log('this is our user',user);
					var index = user._favorites.indexOf(req.body.eventId);
					user._favorites.splice(index, 1);
					user.save(function(erro, use) {
						if (erro) {
							console.log('ERROR', erro)
						}
						else{
							res.json(user);
						}
					})
				}
			})
		},


		
	}
})();