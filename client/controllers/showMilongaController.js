myApp.controller('showMilongaController', function($scope, $routeParams, eventsFactory, $location, $http, $rootScope, $facebook){

	var milongaId = $routeParams.id;
  $window.scrollTo(0, 0);
  

	eventsFactory.getMilonga(milongaId, function(data){

		$scope.milonga = data.data;
		$scope.getButtonsInfo(milongaId)
    
	})




	$scope.saveEvent = function(eventId) {
    if(!$rootScope.user){
      // console.log('!Rosotscope user')
      $('#loginModal').modal();
    }
    else {
        var check = false;
        var id = 's' + eventId;
        for(var i = 0; i < $rootScope.user._favorites.length; i++){
            if(eventId == $rootScope.user._favorites[i]._id){
                check = true;
            };
        };

        if(check == false){
            $('#' + id).css({"box-shadow" : "inset .2em .2em .1em #888888"});
            var datos = {
              eventId: eventId,
              fb_id: $rootScope.user.fb_id,
            }
            eventsFactory.likeEvent(datos, function(data){
                // console.log('back in frontend controller',datos);   
                eventsFactory.stopAttending(datos, function(data){
                    var id = 'a' + eventId;
                    $('#' + id).css({"box-shadow": ".3em .3em .1em #888888"});
                    // console.log('BACK stopAttending profile controller,', data);
                    refreshUser();
                });
            });
        }
        else if(check == true){
            $('#' + id).css({"box-shadow": ".3em .3em .1em #888888"});
            var info = {
                eventId: eventId,
                fb_id: $rootScope.user.fb_id
            }
            eventsFactory.stopSaving(info, function(data){
                // console.log('BACK stopSaving profile controller,', data);
                refreshUser();   
            });
        }//END OF ELSE IF

    }//END OF ELSE
  }

  $scope.attendEvent = function(eventId) {
    if(!$rootScope.user){
      // console.log('!Rosotscope user')
      $('#loginModal').modal();
    }
    else {
        var check = false;
        var id = 'a' + eventId;
        for(var i = 0; i < $rootScope.user._attending.length; i++){
            if(eventId == $rootScope.user._attending[i]._id){
                check = true;
            };
        };

        if(check == false){
            $('#' + id).css({"box-shadow" : "inset .2em .2em .1em #888888"});
            // console.log('attending this event: ', eventId, 'user:', $rootScope.user.name)
            var datos = {
              eventId: eventId,
              fb_id: $rootScope.user.fb_id,
            }
            eventsFactory.attendEvent(datos, function(data){
                // console.log('back in frontend controller',datos);   
                eventsFactory.stopSaving(datos, function(data){
                    var id = 's' + eventId;
                    $('#' + id).css({"box-shadow": ".3em .3em .1em #888888"});
                    // console.log('BACK stopAttending profile controller,', data);
                    refreshUser(); 
                }); 
            });
        }
        else if(check == true){
            $('#' + id).css({"box-shadow": ".3em .3em .1em #888888"});
            var info = {
              eventId: eventId,
              fb_id: $rootScope.user.fb_id
            }
            eventsFactory.stopAttending(info, function(data){
                refreshUser(); 
            });
        }//END OF ELSE IF

    }//END OF ELSE
  }




	$scope.getButtonsInfo = function(mId){
	  setTimeout(function(){ 
	  	if($rootScope.user){
        // console.log($rootScope.user)
          for(var i = 0; i < $rootScope.user._favorites.length; i++){
              if(mId == $rootScope.user._favorites[i]._id){
              	  // console.log('it is saved')
                  var id = 's' + mId;
                  $('#' + id).css({"box-shadow" : "inset .2em .2em .1em #888888"});
              };
          };
          for(var i = 0; i < $rootScope.user._attending.length; i++){
              if(mId == $rootScope.user._attending[i]._id){
              	// console.log('it is attending')
                  var id = 'a' + mId;
                  $('#' + id).css({"box-shadow" : "inset .2em .2em .1em #888888"});
              };
          };
      };

	  }, 50);
      
    };

  function refreshUser() {

      eventsFactory.getUser($rootScope.user.fb_id, function(data){
          $scope.attending = data.data._attending;
          $scope.favorites = data.data._favorites;
          $rootScope.user = data.data;
      }); 
  }

  //FIND MORE ELEGANT SOLUTION TO REMOVE MULTIPLE VERIONS
  setTimeout(function(){
    $rootScope.multipleVersions = false;
    // console.log('DONE!')
  },10000);

  

  
});