myApp.factory('forumFactory', function($http){



	var factory = {};

	var threads = [];

	//threads

	factory.getThreads = function(callback){
		// console.log('made it to Get threads factory');
		$http.get('/threads').then(function(threads){
			// console.log('made it back from backend with threads', threads);
			threads = threads.data;
			callback(threads);
		})
	}

	factory.getThread = function(threadId, callback){
		$http.get('/threads/' + threadId).then(function(thread){
			// console.log('made it back from backend this one thread', thread);
			callback(thread);
		})
	}

	factory.addThread = function(data, callback){
		// console.log('made it to my Add Milonga in the factory');
		$http.post('/threads', data).then(function(data){
			// console.log('made it back from backend this is our new milonga', data.data);
			// milongas.push(data.data);
			callback(data.data);
		})
	}

	factory.destroyThread = function(threadId, callback){
		// console.log('INFO', info)
		$http.post('/threads/' + threadId + '/destroy').then(function(thread){
			// console.log('made it back from backend eddited this performer', performer);
			callback(thread);
		})
	}

	factory.updateThread = function(updateThread, callback){
		$http.post('/threads/' + updateThread._id + '/update', updateThread).then(function(data){
			// console.log('updated Thread:', data.data);
			callback(data.data);
		})
	}

	// comments

	factory.addComment = function(data, callback){
		// console.log('made it to my Add Milonga in the factory');
		$http.post('/comments', data).then(function(data){
			// console.log('made it back from backend this is our new milonga', data.data);
			// milongas.push(data.data);
			callback(data.data);
		})
	}

	factory.destroyComment = function(commentId, callback){
		// console.log('INFO', info)
		$http.post('/comments/' + commentId + '/destroy').then(function(comment){
			// console.log('made it back from backend eddited this performer', performer);
			callback(comment);
		})
	}

	factory.updateComment = function(updateComment, callback){
		$http.post('/comments/' + updateComment._id + '/update', updateComment).then(function(data){
			// console.log('updated comment:', data.data);
			callback(data.data);
		})
	}

	factory.updateViews = function(threadId, callback){
		$http.post('/threads/' + threadId + '/updateViews').then(function(data){
			// console.log('updated comment:', data.data);
			callback(data.data);
		})
	}


	// IMAGES TO AND FROM S3

	factory.uploadPhoto = function (info, callback){
        $http.post('/addImageUrl', info ).then(function(data){
            callback(data);
        });
    };



	return factory;
})