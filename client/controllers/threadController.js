myApp.controller('threadController', function($scope, $routeParams, forumFactory, $location, $window, $http, $rootScope, $facebook,  $window){

    $scope.thread = {};
    $scope.thread.user = '';
    $window.scrollTo(0, 0);

    $scope.toggleClass("forumRow", "calendarRow", "findRow");


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

        if($rootScope.user && $scope.thread._user._id != $rootScope.user._id) {
            forumFactory.updateViews(threadId, function(data){
                // console.log('added view', data)

            })
        }
        else if(!$rootScope.user) {
            forumFactory.updateViews(threadId, function(data){
                // console.log('added view', data)

            })
        }
    })


    $scope.addComment = function(){
        if($scope.form2.$valid == false) {
            return;
        }

        if(!$rootScope.user){
            // console.log('!Rosotscope user')
            $('#loginModal').modal();
        }
        else {

            $scope.comment._user = $rootScope.user._id;
            $scope.comment.threadId = threadId;
            // console.log("comment TO ADD", $scope.comment)
            forumFactory.addComment($scope.comment, function(addedComment){
                // console.log("ADDED Comment", addedComment)
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

    $scope.editCommentt = {};
    
    $scope.editComment = function(tId){

        // console.log(index)
        var index;
        $scope.editCommentt._id = tId;
        for(t in $scope.thread._comments) {
            if($scope.thread._comments[t]._id == tId){
                index = t;
            }
        }

        // editThreadId = $scope.threads[index]._id;

        // console.log(editThreadId)
        $scope.editCommentt.content = $scope.thread._comments[index].content;
        $('#editCommentModal').modal();
    }



    $scope.updateComment = function(){
        console.log('INSIDE UPDATE COMMENT')
        if($scope.form3.$valid == false) {
            return;
        }
        if(!$rootScope.user){
            // console.log('!Rosotscope user')
            $('#loginModal').modal();
        }
        else{


            var info = $scope.editCommentt;

            forumFactory.updateComment(info, function(updatedComment){
                $('#editCommentModal').modal('hide');

                forumFactory.getThread(threadId, function(data){
                    $scope.thread = data.data;
                    $scope.editCommentt = {};
                })

            })
        } //END OF ELSE
    }

});