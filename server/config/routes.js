var milongas = require('./../controllers/milongas.js');
var threads = require('./../controllers/threads.js');


module.exports = function(app){



	//threads

	app.get('/threads', function(req, res){
		console.log(' **************made it to ALL threads get route');
		threads.getThreads(req, res);
	})

	app.post('/threads', function(req, res){
		console.log('made it to my post /threads route');
		threads.createThread(req, res);

	})

	app.get('/threads/:id', function(req, res){
		console.log('made it to my /threads/:id get route');
		threads.getThread(req, res);
	})

	app.post('/threads/:id/updateViews', function(req, res){
		console.log('made it to my /threads/:id/update views post route');
		threads.updateThreadViews(req, res);
	})

	app.post('/threads/:id/update', function(req, res){
		console.log('made it to my /threads/:id/update post route');
		threads.updateThread(req, res);
	})

	app.post('/threads/:id/destroy', function(req,res) {
		console.log('made it to my /destroy thread route');
		threads.destroyThread(req,res);
	})




	//comments

	app.post('/comments', function(req, res){
		console.log('made it to my post /comments route');
		threads.createComment(req, res);

	})

	app.post('/comments/:id/update', function(req, res){
		console.log('made it to my /comments/:id/update post route');
		threads.updateComment(req, res);
	})

	app.post('/comments/:id/destroy', function(req,res) {
		console.log('made it to my /destroy Comment route');
		threads.destroyComment(req,res);
	})




	//account linking

	app.post('/linkAccounts', function(req, res){
		console.log(' made it to my /accountLinking get route', req.body);
		milongas.linkAccounts(req, res);
	})

	app.post('/acceptAccountLinking', function(req, res){
		console.log(' made it to my /accountLinking get route', req.body);
		milongas.acceptAccountLinking(req, res);
	})

	app.get('/linkingRequests', function(req, res){
		console.log(' **************made it to my /requests get route', req.body);
		milongas.getLinkingRequests(req, res);
	})
	app.post('/linkingRequests/:id/destroy', function(req,res) {
		console.log('made it to my /destroy Comment route');
		milongas.destroyLinkingRequest(req,res);
	})




	//update teachers profile

	app.post('/performers/:id/updateProfile', function(req, res){
		console.log('made it to my /performers update post route');
		milongas.updatePerformerProfile(req, res);
	})


	//get users

	app.get('/users', function(req, res){
		console.log(' made it to my /Users get route');
		milongas.getUsers(req, res);
	})

	//everything else
	
	app.post('/milongas/:id/update', function(req, res){
		console.log('made it to my /milongas/:id/update post route');
		milongas.updateMilonga(req, res);
	})

	app.post('/classes/:id/update', function(req, res){
		console.log('made it to my /classes/:id/update post route');
		milongas.updateClass(req, res);
	})
	
	app.post('/milongas/get', function(req, res){
		console.log(' **************made it to my /milongas/get get route', req.body);
		milongas.getMilongas(req, res);
	})

	app.get('/allevents', function(req, res){
		console.log(' **************made it to ALL EVENTS get route');
		milongas.allEvents(req, res);
	})

	app.post('/milongas', function(req, res){
		console.log('made it to my post /milongas route');
		milongas.createMilonga(req, res);

	})

	app.post('/classes', function(req, res){
		console.log('made it to my post /classes route');
		milongas.createClass(req, res);

	})

	app.post('/classes/get', function(req, res){
		console.log(' made it to my /classes/get get route', req.body);
		milongas.getClasses(req, res);
	})

	app.get('/milongas/count', function(req, res){
		console.log('made it to my /milongas count get route');
		milongas.countMilongas(req, res);
	})

	app.get('/classes/:id', function(req, res){
		console.log('made it to my /classes/:id get route');
		milongas.getClass(req, res);
	})

	app.get('/milongas/:id', function(req, res){
		console.log('made it to my /milongas/:id get route');
		milongas.getMilonga(req, res);
	})

	app.post('/requests', function(req, res){
		console.log('made it to my post /requests route');
		milongas.createRequest(req, res);

	})

	app.post('/requests/:id/edit', function(req, res){
		console.log('made it to my post /requests EDIT route');
		milongas.editRequest(req, res);

	})

	app.post('/attendees', function(req, res){
		console.log(' made it to my /attendees get route', req.body);
		milongas.getAttendees(req, res);
	})

	app.get('/performers', function(req, res){
		console.log(' made it to my /performers get route');
		milongas.getPerformers(req, res);
	})

	app.get('/requests', function(req, res){
		console.log(' made it to my /requests get route');
		milongas.getRequests(req, res);
	})

	app.post('/performers/:id/update', function(req, res){
		console.log('addMilongaToPerformer ROUTE', req.body);
		milongas.addMilongaToPerformer(req, res);
	})

	app.post('/performers/:id/addClass', function(req, res){
		console.log('addClassToPerformer ROUTE', req.body);
		milongas.addClassToPerformer(req, res);
	})

	app.post('/users', function(req, res){
		console.log('made it to my /users post route');
		milongas.createUser(req, res);
	})

	app.get('/users/:id', function(req, res){
		console.log('made it to my /users/:id get route');
		milongas.getUser(req, res);
	})

	app.post('/users/:id/updatecity', function(req, res){
		console.log('made it to my /users/:id/updatecity post route');
		milongas.updateUsersCity(req, res);
	})
	
	app.post('/users/:id/update', function(req, res){
		console.log('made it to my /users/:id/update post route');
		milongas.likeEvent(req, res);
	})

	app.post('/users/:id/saveClass', function(req, res){
		console.log('made it to my /users/:id/saveClass post route');
		milongas.likeClass(req, res);
	})

	app.post('/users/:id/attendClass', function(req, res){
		console.log('made it to my /users/:id/attendClass post route');
		milongas.attendClass(req, res);
	})

	app.post('/users/:id/attend', function(req, res){
		console.log('made it to my /users/:id/attend post route');
		milongas.attendEvent(req, res);
	})

	app.post('/performers/:id/removeMilonga', function(req,res) {
		console.log('made it to my /performers/:id/update post route');
		milongas.removeMilongaFromPerformer(req,res);
	})

	app.post('/performers/:id/removeClass', function(req,res) {
		console.log('made it to my /performers/:id/update post route');
		milongas.removeClassFromPerformer(req,res);
	})

	app.post('/requests/:id/destroy', function(req,res) {
		console.log('made it to my /destroy request');
		milongas.destroyRequest(req,res);
	})

	app.post('/performers', function(req, res){
		console.log('made it to my post performer route');
		milongas.createPerformer(req, res);

	})

	app.get('/performers/:id', function(req, res){
		console.log('made it to my /performers/:id get route');
		milongas.getPerformer(req, res);
	})

	app.post('/stopAttendingClass', function(req, res){
		// console.log('made it to my /users/:id/update post route');
		milongas.stopAttendingClass(req, res);
	})

	app.post('/stopAttending', function(req, res){
		// console.log('made it to my /users/:id/update post route');
		milongas.stopAttending(req, res);
	})

	app.post('/stopSavingClass', function(req, res){
		// console.log('made it to my /users/:id/update post route');
		milongas.stopSavingClass(req, res);
	})

	app.post('/stopSaving', function(req, res){
		// console.log('made it to my /users/:id/update post route');
		milongas.stopSaving(req, res);
	})
}