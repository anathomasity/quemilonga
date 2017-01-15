myApp.controller('threadController', function($scope, $routeParams, forumFactory, $location, $http, $rootScope, $facebook){

    $scope.thread = {};
    $scope.thread.user = '';

    // forumFactory.getThreads(function(dat){
    //     $scope.threads = dat;
    // })

    // $scope.newThread = function(){
    //     $('#newThreadModal').modal();

    // }

    // $scope.addThread = function(){

    //     if(!$rootScope.user){
    //         // console.log('!Rosotscope user')
    //         $('#loginModal').modal();
    //     }
    //     else {

    //         $scope.thread._user = $rootScope.user._id;
    //         console.log("SCOPE THREAD TO ADD", $scope.thread)
    //         forumFactory.addThread($scope.thread, function(addedThread){
    //             console.log("ADDED THREAD", addedThread)
    //             $('#newThreadModal').modal('hide');

    //             forumFactory.getThreads(function(dat){
    //                 $scope.threads = dat;

    //             })

    //         });

    //     } //END OF ELSE

    // };
    var threadId = $routeParams.id;


    forumFactory.getThread(threadId, function(data){
        $scope.thread = data.data;
    })


    $scope.addComment = function(){

        if(!$rootScope.user){
            // console.log('!Rosotscope user')
            $('#loginModal').modal();
        }
        else {

            $scope.comment._user = $rootScope.user._id;
            $scope.comment.threadId = threadId;
            console.log("comment TO ADD", $scope.comment)
            forumFactory.addComment($scope.comment, function(addedComment){
                console.log("ADDED Comment", addedComment)
                forumFactory.getThread(threadId, function(data){
                    $scope.thread = data.data;
                    $scope.comment = {};
                })
                

            });

        } //END OF ELSE

    };

    $scope.editThread = function(tId){

        // console.log(index)
        var index;
        for(t in $scope.threads) {
            if($scope.threads[t]._id == tId){
                index = t;
            }
        }

        // editThreadId = $scope.threads[index]._id;

        // console.log(editThreadId)
        $scope.thread.title = $scope.threads[index].title;
        $scope.thread.content = $scope.threads[index].content;
        $scope.thread._id = $scope.threads[index]._id;
        $('#editThreadModal').modal();
    }



    $scope.updateThread = function(){
        if(!$rootScope.user){
            // console.log('!Rosotscope user')
            $('#loginModal').modal();
        }
        else{

            var info = $scope.thread;

            forumFactory.updateThread(info, function(updatedThread){
                $('#editThreadModal').modal('hide');

                forumFactory.getThreads(function(dat){
                    $scope.threads = dat;
                })

            })
        } //END OF ELSE
    }

    $scope.destroyThread = function(tId){
        // console.log('destroying Thread!!', index);
        // var threadId = $scope.threads[index]._id;
        forumFactory.destroyThread(tId, function(destroyedThread){
            forumFactory.getThreads(function(dat){
                $scope.threads = dat;
            })
        })
    }

    $scope.destroyComment = function(cId){
        forumFactory.destroyComment(cId, function(destroyedComment){
            forumFactory.getThread(threadId, function(data){
                $scope.thread = data.data;
            })
        })
    }

});