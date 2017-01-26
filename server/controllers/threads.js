var mongoose = require('mongoose');
var Performer = mongoose.model('performer');
// var Milonga = mongoose.model('milonga');
// var Request = mongoose.model('request');
var User = mongoose.model('user');
// var Class = mongoose.model('class');
var Thread = mongoose.model('thread');
var Comment = mongoose.model('comment');
var moment = require('moment');

module.exports = (function() {
	return {

		uploadUrl: function(req, res){
			console.log('IMAGE URL ************************BACKEND ******************', req.body);
	      // console.log(req.params.id); 
	      // console.log(req.body)
	      // User.findByIdAndUpdate({_id: req.params.id}, { profile_pic: req.body.image}, {new: true}, function(err, updatedUser){
	      //   if(err){
	      //     console.log('error', err);
	      //   }
	      //   else{
	      //     console.log('success, this is the updated user: ', updatedUser); 
	      //     res.json(updatedUser);
	      //   }
	      // })
	    },



		getThreads: function(req, res){

			Thread.find({})
			.populate('_user')
			.populate('_comments')
			
			.exec(function (err, threads) {
			  if(err){
					console.log("error finding the threads", err);
				} else {
					console.log('this is our threads',threads);
					res.json(threads);
				}
			});
		},

		getThread: function(req, res){
			console.log('************reqparamsID', req.params.id)
			Thread.findOne({_id: req.params.id})
			.populate('_user')
			.populate({ 
			     path: '_comments',
			     populate: {
			       path: '_user',
			       model: 'user'
			    } 
			})
			
			.exec(function (err, thread) {
			  if(err){
					console.log("error finding the thread", err);
				} else {
					console.log('this is our thread',thread);
					res.json(thread);
				}
			});
		},

		createThread: function(req, res){
			console.log(req.body, 'THIS IS REQ BODY');
			thread = new Thread(req.body);
			thread.save(function(err, result){
				if(err){
					console.log(err);
					console.log('error creating a new thread');
				} else {
					console.log('this is our new thread',result);
					res.json(result);
				}
			})
		},

		updateThread: function(req, res){

			Thread.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, result){
			    if(err){
			        console.log("Something wrong when updating Thread!");
			    } else {
					console.log('updated Thread: ', result);
					res.json(result);
				}
			});

		},

		updateThreadViews: function(req, res){
			console.log("***************AT UPDATE***************")
			Thread.findOne({_id: req.params.id}, function (err, thread){
				if(err){
					console.log('********************ERROR FINDING THREAD',err)
				}
				else{
					thread.views = thread.views+1;
				    thread.save(function (err) {
				        if(err) {
				            console.log('********************ERROR SAVING THREAD!');
				        }
				        else{
				        	console.log('SUCCES********************', thread)
				        	res.json({status:'ok'});
				        }
				    });
				}
				
			});

		},

		destroyThread: function(req, res){
			Thread.findByIdAndRemove(req.params.id, function(err){
				if(err){
					console.log('error removing Thread')
				}
				else{
					res.json({status:'ok'})
				}

			})
		},

		//COMMENTS

		createComment: function(req, res){
			console.log(req.body, 'THIS IS REQ BODY');
			comment = new Comment(req.body);
			comment.save(function(err, result){
				if(err){
					console.log(err);
					console.log('error creating a new Comment');
				} 

				else {
					console.log('this is our new Comment',result);


					if(req.body.type && req.body.type == 'performer'){
						Performer.findOne({_id: req.body.performerId}, function (err, performer){
							if(err){
								console.log('********************ERROR FINDING performer',err)
							}
							else{
								performer._comments.push(result._id);
							    performer.save(function (err) {
							        if(err) {
							            console.log('********************ERROR SAVING performer!');
							        }
							        else{
							        	console.log('SUCCES********************', performer)
							        	res.json({status:'ok'});
							        }
							    });
							}
							
						});
					}
					else{
						Thread.findOne({_id: req.body.threadId}, function (err, thread){
							if(err){
								console.log('********************ERROR FINDING THREAD',err)
							}
							else{
								thread._comments.push(result._id);
							    thread.save(function (err) {
							        if(err) {
							            console.log('********************ERROR SAVING THREAD!');
							        }
							        else{
							        	console.log('SUCCES********************', thread)
							        	res.json({status:'ok'});
							        }
							    });
							}
							
						});
					}
					

				}
			})
		},

		updateComment: function(req, res){

			Comment.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, result){
			    if(err){
			        console.log("Something wrong when updating Comment!");
			    } else {
					console.log('updated Comment: ', result);

					res.json(result);
				}
			});

		},

		destroyComment: function(req, res){
			Comment.findByIdAndRemove(req.params.id, function(err){
				if(err){
					console.log('error removing Comment')
				}
				else{
					res.json({status:'ok'})
				}

			})
		},


	}
})();