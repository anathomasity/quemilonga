var milongas = require('./../controllers/milongas.js');

module.exports = function(app){
	// app.post('/dummies/:test', function(req, res){
		
	// 	// I'm testing the info that I'm getting from my dummy Factory
	// 	// I console.log the body and the params just to make sure that it's
	// 	// going through 

	// 	console.log(req.body);
	// 	console.log(req.params.test)
	// 	// mongooseController.getMongooses(req, res);
	// })
	app.post('/milongas/get', function(req, res){
		console.log(' made it to my /milongas/get get route', req.body);
		milongas.getMilongas(req, res);
	})

	app.post('/milongas', function(req, res){
		console.log('made it to my post /milongas route');
		milongas.createMilonga(req, res);

	})
	app.get('/performers', function(req, res){
		console.log(' made it to my /performers get route');
		milongas.getPerformers(req, res);
	})

	app.get('/milongas/:id', function(req, res){
		console.log('made it to my /milongas/:id get route');
		milongas.getMilonga(req, res);
	})

	app.post('/milongas/:id/update', function(req, res){
		console.log('made it to my /milongas/:id/update post route');
		milongas.updateMilonga(req, res);
	})
	app.post('/performers/:id/update', function(req, res){
		console.log('made it to my /performers/:id/update post route');
		milongas.addMilongaToPerformer(req, res);
	})

	app.post('/performers/:id/removeMilonga', function(req,res) {
		console.log('made it to my /performers/:id/update post route');
		milongas.removeMilongaFromPerformer(req,res);
	})

	app.post('/performers', function(req, res){
		console.log('made it to my post performer route');
		milongas.createPerformer(req, res);

	})

	app.get('/performers/:id', function(req, res){
		console.log('made it to my /performers/:id get route');
		milongas.getPerformer(req, res);
	})
}