var mongoose = require('mongoose');
var Performer = mongoose.model('performer');
var Milonga = mongoose.model('milonga');
var Request = mongoose.model('request');
var User = mongoose.model('user');
var Class = mongoose.model('class');
var moment = require('moment');

module.exports = (function() {
	return {

		getAttendees: function(req,res) {

			// console.log('GOT TO GET ATTENDEES BACKEND', req.body)

			if(req.body.eventType == 'milonga') {
				User.find({ _attending: { "$in" : [req.body.eventId]} }, function(err, attendees){
					if(err){
						// console.log(err);
						// console.log('error finding ATTENDEES, milongas controller');
					} else {
						// console.log('ATTENDEES::::::::', attendees)
						res.json(attendees);
					} //END OF ELSE

				});
			}
			else if(req.body.eventType == 'class') {
				User.find({ _class_attending: { "$in" : [req.body.eventId]} }, function(err, attendees){
					if(err){
						// console.log(err);
						// console.log('error finding ATTENDEES, milongas controller');
					} else {
						// console.log('ATTENDEES::::::::', attendees)
						res.json(attendees);
					} //END OF ELSE

				});
			}
		},


		getPerformers: function(req, res){

			Performer.find({}, function(err, performers){
				if(err){
					console.log(err);
					console.log('error finding performers, milongas controller');
				} else {
					res.json(performers);
				} //END OF ELSE
			})
		},

		allEvents: function(req, res){

			var events = [];
			Milonga.find({}, function(err, milongas){
				if(err){
					console.log(err);
					console.log('error finding milongas, milongas controller');
				} else {
					for(m in milongas){
						events.push(milongas[m])
					}
					Class.find({}, function(err, classes){
						if(err){
							console.log(err);
							console.log('error finding classes, classes controller');
						} else {
							for(m in classes){
								events.push(classes[m])
							}
							res.json(events);
						} //END OF ELSE
					})
				} //END OF ELSE
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

			console.log('GET MILONGAS:', req.body);
			Milonga.find({"address.state" : req.body.state.state})
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
					// console.log('****************DATE********************', req.body.date);
					for(var m in milongas){


						var m_date = moment(milongas[m].date).format('YYYY MM DD');


							if(m_date == req.body.dates.today){
								milongas_per_day.today.push(milongas[m]);
							}

							else if(m_date == req.body.dates.tomorrow){
								milongas_per_day.tomorrow.push(milongas[m]);
							}

							else if(m_date == req.body.dates.day_after){
								milongas_per_day.day_after.push(milongas[m]);
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

		countMilongas: function(req, res){

			console.log('COUNT MILONGAS AT BACKEND');

			Milonga.aggregate(
		        {
		            $group: {
		                _id: '$address.country',
		                count: {$sum: 1}
		            }
		        }
		    , function (err, result) {
		        if (err) {
		            console.log('********************************************ERROR',err);
		        } else {
		            console.log('*******************************************RESULT', result);
		            res.json(result)
		        }
		    });

			// var data = [];

			// Milonga.find({}, function(err, milongas){
			// 	if(err){
			// 		console.log(err);
			// 		console.log('error finding milongas, count milongas at controller');
			// 	} else {
			// 		console.log('MILONGAS HERE **********', milongas)

			// 	}
			// })
			
			
		},
		
		getMilonga: function(req, res){
			console.log('************reqparamsID', req.params.id)
			Milonga.findOne({_id: req.params.id})
			.populate('_performers')
			.populate('_class_teachers')
			
			.exec(function (err, milonga) {
			  if(err){
					console.log("error finding the milonga", err);
				} else {
					console.log('this is our milonga',milonga);
					res.json(milonga);
				}
			});
		},
		updateMilonga: function(req, res){

			Milonga.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, result){
			    if(err){
			        console.log("Something wrong when updating milonga!");
			    } else {
					console.log('updated milonga: ', result);
					res.json(result);
				}
			});

		},







		createClass: function(req, res){
			console.log(req.body, 'THIS IS REQ BODY');
			clas = new Class(req.body);
			clas.save(function(err, result){
				if(err){
					console.log(err);
					console.log('error creating a new class');
				} else {
					console.log('this is our new class',result);
					res.json(result);

				}
			})
		},
		getClasses: function(req, res){

			console.log('GET classes:', req.body);
			Class.find({"address.state" : req.body.state.state})
			.populate('_class_teachers')
			.exec(function(err, classes){
				if(err){
					console.log(err);
					console.log('error finding classes, classes controller');
				} else {
					// console.log('THIS ARE THE classes:', classes);
					classes_per_day = {
						today: [],
						tomorrow: [],
						day_after: [], 
					}
					// console.log(new Date())
					for(var m in classes){


						// IF THE USER SPECIFIED A DATE, USE THAT TO DIVIDE classes, ELSE USE TODAYS DATE
						var m_date = moment(classes[m].date).format('YYYY MM DD');


						if(m_date == req.body.dates.today){
							classes_per_day.today.push(classes[m]);
						}

						else if(m_date == req.body.dates.tomorrow){
							classes_per_day.tomorrow.push(classes[m]);
						}

						else if(m_date == req.body.dates.day_after){
							classes_per_day.day_after.push(classes[m]);
						}

						// console.log(classes_per_day);
					}

					res.json(classes_per_day);
					classes_per_day = {
						today: [],
						tomorrow: [],
						day_after: [], 
					}
				}
			})
		},

		getClass: function(req, res){
			console.log('************reqparamsID', req.params.id)
			Class.findOne({_id: req.params.id})
			.populate('_class_teachers')

			
			.exec(function (err, clas) {
			  if(err){
					console.log("error finding the clas", err);
				} else {
					console.log('this is our clas',clas);
					res.json(clas);
				}
			});
		},


		updateClass: function(req, res){

			console.log('********************************HERE', req.body)
			Class.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, result){
			    if(err){
			        console.log("Something wrong when updating class!");
			    } else {
					console.log('updated class: ', result);
					res.json(result);
				}
			});

		},








		createPerformer: function(req, res){
			console.log('CREATE PERFORMER WITH:', req.body);
			Performer.findOne({_id: req.body.perfId}, function(err, performer){
				if(err){
					console.log("error finding the performer", err);
				}
				else {
					// console.log('this is our user',user);
					performer.pending = false;
					performer.save(function(erro, performer) {
						if (erro) {
							console.log('ERROR', erro)
						}
						else{
							res.json(performer);
						}
					})
				}
			})
		},
		getPerformer: function(req, res){

			Performer.findOne({_id: req.params.id})
			.populate('_milongas_attending.milonga')
			.populate('_milongas_attending.class')

			
			.exec(function (err, milonga) {
			  if(err){
					console.log("error finding the performer", err);
				} else {
					console.log('this is our performer',milonga);
					res.json(milonga);
				}
			});
		},
		// createRequest: function(req, res){
		// 	console.log(req.body, 'THIS IS REQ BODY');
		// 	request = new Request(req.body);
		// 	request.save(function(err, result){
		// 		if(err){
		// 			console.log(err);
		// 			console.log('error creating a new request');
		// 		} else {
		// 			console.log('this is our new request',result);
		// 			res.json(result);

		// 		}
		// 	})
		// },





		createRequest: function(req, res){
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
		getRequests: function(req, res){
			Performer.find({pending: {$eq: true}}, function(err, requests){
				if(err){
					console.log(err);
					console.log('error finding requests, milongas controller');
				} else {
					console.log('THIS ARE THE REQUESTS', requests)
					res.json(requests);
				}
			})
		},
		destroyRequest: function(req, res){
			Performer.findByIdAndRemove(req.params.id, function(err){
				if(err){
					console.log('error removing request')
				}
				else{
					res.json({status:'ok'})
				}

			})
		},
		editRequest: function(req,res){




			Performer.findOneAndUpdate({ "_id": req.params.id }, { "$set": { "pending": false, "name": req.body.name, "from": req.body.from}}).exec(function(err, request){
			   if(err) {
			       console.log(err);
			   } else {
			       res.json(request)
			   }
			});
		},









		addMilongaToPerformer: function(req, res){

			Performer.findOne({_id: req.params.id}, function (err, performer){
				if(performer == null){
					res.json({status: 'This is a PENDING performer'})
					return;
				}
				console.log('GOT TO THE BACKEND CONTROLLER, this is REQ.BODY', req.body)
				performer._milongas_attending.push({milonga: req.body.milonga, action: req.body.action});
				console.log('THIS IS THE PERFORMER',performer);
			    performer.save(function (err) {
			        if(err) {
			            console.log('ERROR ADDING EVENT TO PERFORMER!');
			        }
			        else{
			        	res.json(performer);
			        }
			    });
			});

		},

		addClassToPerformer: function(req, res){

			Performer.findOne({_id: req.params.id}, function (erro, performer){
				if(performer == null){
					res.json({status: 'This is a PENDING performer'})
					return;
				}
				console.log('//////////*****GOT TO THE BACKEND CONTROLLER, this is REQ.BODY.class *****//////////', req.body.class)
				performer._milongas_attending.push({class: req.body.class, action: req.body.action});
				console.log('THIS IS THE PERFORMER',performer);
			    performer.save(function (err) {
			        if(err) {
			            console.log('ERROR ADDING EVENT TO PERFORMER!');
			        }
			        else{
			        	res.json(performer);
			        }
			    });
			});

		},

		removeMilongaFromPerformer: function(req, res){

			Performer.findOne({_id: req.params.id}, function (err, performer){
				if(performer == null){
					res.json({status: 'This is a PENDING performer'})
					return;
				}
				console.log('************************REMOVE MILONGA FROM PERFORMER', req.body)

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
		removeClassFromPerformer: function(req, res){
			console.log('**************************REMOVE CLASS FROM PERFORMER', req.body)

			Performer.findOne({_id: req.params.id}, function (err, performer){
				console.log('PERFORMER TO RMOVE CLASS', performer)
				if(performer == null || err) {
					console.log('ERROR **********************', err);
					return;
				}
				else{



					var searchTerm = req.body.classId;
					var index = -1;
					console.log('before splice:', performer._milongas_attending)
					console.log('performer', performer);
					for(var i = 0; i < performer._milongas_attending.length; i++) {
					    if (performer._milongas_attending[i].class == searchTerm) {
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
				}
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


			//OTHER VERSION TRYING TO FIND IT BEFORE TRYING TO CREATE A NEW ONE
			// User.findOne({fb_id: req.body.fb_id})
			// .populate('_favorites')
			// .populate('_attending')
			// .exec(function (erro, user) {
			//     if(erro){
			// 		console.log('USER DOESNT EXIST', erro);
			// 		console.log(req.body, 'THIS IS REQ BODY');
			// 		user = new User(req.body);
			// 		user.save(function(err, result){
			// 			if (err){
			// 				console.log('error saving new user', err)
			// 			}
			// 			else {
			// 				console.log('this is our new user',result);
			// 				res.json(result);
			// 			};
			// 		});
			// 	} 
			// 	else {
			// 		console.log('FOUND EXISTENT USER',user);
			// 		res.json(user);
			// 	}
			// });
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
			.populate({ 
			     path: '_class_attending',
			     populate: {
			       path: '_class_teachers',
			       model: 'performer'
			    } 
			})
			.populate({ 
			     path: '_class_favorites',
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

		likeClass: function(req, res){

			User.findOne({fb_id: req.params.id}, function (err, user){
				console.log('***************THIS IS REQ.BODY', req.body)
				console.log('****************THIS IS THE USER', user)
				var check = false;
				for(var i = 0; i < user._class_favorites.length; i++){
					if(user._class_favorites[i] == req.body.eventId){
						check = true;
					}
				}
				if(check == false) {
					user._class_favorites.push(req.body.eventId);
					// console.log('THIS IS THE user',user);
				    user.save(function (erro) {
				        if(erro) {
				            console.error('ERROR ADDING EVENT TO user!', erro);
				        }
				        else{
				        	console.log('ADDED CLASS TO USER', user)
				        	res.json({status:'ok!'});
				        };
				    });
				}
				else{
					console.log('CLASS ALREADY SAVED');
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
		attendClass: function(req, res){

			User.findOne({fb_id: req.params.id}, function (err, user){
				console.log('GOT TO THE BACKEND CONTROLLER', req.body)
				var check = false;
				for(var i = 0; i < user._class_attending.length; i++){
					if(user._class_attending[i] == req.body.eventId){
						check = true;
					}
				}
				if(check == false) {
					user._class_attending.push(req.body.eventId);
					// console.log('THIS IS THE user',user);
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
					// console.log('ALREADY ATTENDING THIS EVENT');
				}
			});
		},
		stopAttendingClass: function(req,res){
			User.findOne({fb_id: req.body.fb_id}, function(err, user){
				if(err){
					console.log("error finding the user", err);
				}
				else {
					// console.log('this is our user',user);
					var index = user._class_attending.indexOf(req.body.eventId);
					if(index == -1){
						console.log('******************DIDNT FIND IT'); 
						res.json(user);
					}
					else{
						user._class_attending.splice(index, 1);
						user.save(function(erro, use) {
							if (erro) {
								console.log('ERROR', erro)
							}
							else{
								res.json(user);
							}
						})
					}					
				}
			})
		},
		stopAttending: function(req,res){
			User.findOne({fb_id: req.body.fb_id}, function(err, user){
				if(err){
					console.log("error finding the user", err);
				}
				else {
					// console.log('this is our user',user);
					var index = user._attending.indexOf(req.body.eventId);
					if(index == -1){
						console.log('******************DIDNT FIND IT'); 
						res.json(user);
					}
					else{
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
					
				}
			})
		},
		stopSavingClass: function(req,res){
			User.findOne({fb_id: req.body.fb_id}, function(err, user){
				if(err){
					console.log("error finding the user", err);
				}
				else {
					// console.log('this is our user',user);
					var index = user._class_favorites.indexOf(req.body.eventId);
					if(index == -1){
						console.log('******************DIDNT FIND IT'); 
						res.json(user);
					}
					else{
						user._class_favorites.splice(index, 1);
						user.save(function(erro, use) {
							if (erro) {
								console.log('ERROR', erro)
							}
							else{
								res.json(user);
							}
						})
					}
					
				}
			})
		},
		stopSaving: function(req,res){
			User.findOne({fb_id: req.body.fb_id}, function(err, user){
				if(err){
					console.log("error finding the user", err);
				}
				else {
					// console.log('this is our user',user);
					var index = user._favorites.indexOf(req.body.eventId);
					if(index == -1){
						console.log('******************DIDNT FIND IT'); 
						res.json(user);
					}
					else{
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
					
				}
			})
		},
		updateUsersCity: function(req, res){
					console.log("THIS IS REQBODY", req.body);
			User.findOne({fb_id: req.params.id}, function(err, user){
				if(err){
					console.log("error finding the user", err);
				}
				else {
					// console.log('this is our user',user);
					user.city_preference = {
						city: req.body.city,
						state: req.body.state.state,
						coordinates: req.body.pos,
					}
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
		linkAccounts: function(req, res){
			console.log("THIS IS REQBODY CONTROLLER ************", req.body);

			request = new Request(req.body);
			request.save(function(err, result){
				if(err){
					console.log(err);
					console.log('error creating a new request');
				} else {
					console.log('this is our new request',result);
					res.json('ok');

				}
			})

		},

		acceptAccountLinking: function(req,res){

			console.log("THIS IS REQBODY CONTROLLER ************", req.body);

			if(req.body.user.performerId){
				Performer.findOne({_id: req.body.user.performerId}, function(err, perf){
					if(err){
						console.log("error finding the performer", err);
					}
					else{
						perf.userId = undefined;
						perf.fb_id = undefined;
						perf.save(function(erro, perf) {
							if (erro) {
								console.log('ERROR removing previous linking from PERF', erro)
							}
							else{
								console.log('REMOVED USER FROM PERFORMER***************', perf)
							}
						})
					}
				});
			}

			if(req.body.performer.userId){
				User.findOne({_id: req.body.performer.userId}, function(err, us){
					if(err){
						console.log("error finding theUSER", err);
					}
					else{
						us.performerId = undefined;
						us.save(function(erro, us) {
							if (erro) {
								console.log('ERROR removing previous linking from USER', erro)
							}
							else{
								console.log('REMOVED PERFORMER FROM USER***************', us)
							}
						})
					}
				});
			}

			Performer.findOne({_id: req.body.performer._id}, function(err, performer){
				if(err){
					console.log("error finding the performer", err);
				}
				else {
					performer.fb_id = req.body.fb_id;
					performer.userId = req.body.user._id;
					performer.save(function(erro, perf) {
						if (erro) {
							console.log('ERROR SAVING PERFORMER', erro)
						}
						else{
							User.findOne({_id: req.body.user._id}, function(err, user){
								if(err){
									console.log("error finding the user", err);
								}
								else {
									// console.log('this is our user',user);
									user.performerId = req.body.performer._id;
									user.save(function(erro, user) {
										if (erro) {
											console.log('ERROR SAVING USER', erro)
										}
										else{
											res.json({user: user, performer: performer})
										}
									})
								}
							})

						}
					})
				}
			})
		},
		getLinkingRequests: function(req, res){
			Request
			.find({})
			.populate('user')
			.populate('performer')
			.exec(function (err, requests) {
			  if (err) {
			  	return handleError(err);
			  }
			  else{
			  	console.log("THIS ARE LINKING REQUESTS", requests)
			  	res.json(requests);
			  }			  

			})
		},
		destroyLinkingRequest: function(req, res){
			Request.findByIdAndRemove(req.params.id, function(err){
				if(err){
					console.log('error removing request')
				}
				else{
					res.json({status:'ok'})
				}

			})
		},


		updatePerformerProfile: function(req, res){
			console.log("THIS IS REQBODY UPDATE ********************", req.body);
			Performer.findOne({_id: req.params.id}, function(err, performer){
				if(err){
					console.log("error finding the performer", err);
				}
				else {
					// console.log('this is our performer',performer);
					if (req.body._favorite_dancers.length > 0) {
					performer._favorite_dancers = req.body._favorite_dancers;}
					if (req.body.youtubeLink) {
					performer.youtubeLink = req.body.youtubeLink;}
					if (req.body.from) {
					performer.from = req.body.from;}
					if (req.body._partner[0]) {
					performer._partner = req.body._partner[0];}
					if (req.body.introduction) {
					performer.introduction = req.body.introduction;}
					performer.save(function(erro, performer) {
						if (erro) {
							console.log('ERROR', erro)
						}
						else{
							res.json(performer);
						}
					})
				}
			})

		},


		
	}
})();