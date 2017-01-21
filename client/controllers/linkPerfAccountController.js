myApp.controller('linkPerfAccountController', function($scope, $rootScope, $routeParams, forumFactory, eventsFactory, $location, $window, $http, $rootScope, $facebook, $window){

    $rootScope.teachers = [];
    $window.scrollTo(0, 0);
    


    eventsFactory.getPerformers(function(dat){
        // console.log('performers:',data);
        for ( var i = 0; i < dat.length; i++){

            $rootScope.teachers.push({name: dat[i].name, _id: dat[i]._id})

        }

    })



    $scope.accountLinkingModal = function(){
        if(!$rootScope.user){
            $('#loginModal').modal();
        }
        if($scope.outputTeachers.length < 1){
            $scope.erre = 'Please select a teacher and try again'
            return
        }
        // if($scope.outputTeachers[0].name.toUpperCase() != $rootScope.user.first_name.concat(' ' + $rootScope.user.last_name).toUpperCase()){
        //     $scope.notEquals = true;
        // }
        $('#accountLinkingModal').modal();
    }

    $scope.linkAccounts = function(){
        // console.log($scope.outputTeachers[0].name)
        // console.log($scope.outputTeachers[0].name, $rootScope.user.first_name.concat(' ' + $rootScope.user.last_name))
        var info = {
            user : $rootScope.user._id,
            fb_id : $rootScope.user.fb_id,
            performer: $scope.outputTeachers[0]._id,
        }
        // console.log(info)
        eventsFactory.linkAccounts(info, function(status){
            // console.log('STATUS', status)
            if(status.data == 'ok'){
                $scope.success = 'Request successfully made. Your request will be processed in a few hours.'
                
                setTimeout(function(){
                    $('#accountLinkingModal').modal('hide');

                }, 4000)

            }
        })
    }

});