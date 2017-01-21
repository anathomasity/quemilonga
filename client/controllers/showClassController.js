myApp.controller('showClassController', function($scope, $routeParams, eventsFactory, $location, $http, $rootScope, $facebook){

	var classId = $routeParams.id;
	eventsFactory.getClass(classId, function(data){
		$scope.class = data.data;
		$scope.getButtonsInfo(classId)
    
	})


  $scope.saveClass = function(eventId) {
    // console.log('INSIDE SAVE CLASS')
    if(!$rootScope.user){
      // console.log('!Rosotscope user')
      $('#loginModal').modal();
    }
    else {
        var check = false;
        var id = 'sc' + eventId;

        //if class already saved by the current user, say true
        for(var i = 0; i < $rootScope.user._class_favorites.length; i++){
            if(eventId == $rootScope.user._class_favorites[i]._id){
                check = true;
                // console.log("CLASS ALREADY SAVED")
            };
        };

        //if not already saved by current user, save:
        if(check == false){

            $('#' + id).css({"box-shadow" : "inset .2em .2em .1em #888888"});
            var datos = {
              eventId: eventId,
              fb_id: $rootScope.user.fb_id,
            }
            eventsFactory.likeClass(datos, function(data){
                // console.log('back in frontend controller',datos);   
                eventsFactory.stopAttendingClass(datos, function(data){
                    var id = 'ac' + eventId;
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
            eventsFactory.stopSavingClass(info, function(data){
                // console.log('BACK stopSaving profile controller,', data);
                refreshUser();   
            });
        }//END OF ELSE IF

    }//END OF ELSE
  }

  $scope.attendClass = function(eventId) {
    if(!$rootScope.user){
      // console.log('!Rosotscope user')
      $('#loginModal').modal();
    }
    else {
        var check = false;
        var id = 'ac' + eventId;
        for(var i = 0; i < $rootScope.user._class_attending.length; i++){
            if(eventId == $rootScope.user._class_attending[i]._id){
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
            eventsFactory.attendClass(datos, function(data){
                // console.log('back in frontend controller',datos);   
                eventsFactory.stopSavingClass(datos, function(data){
                    var id = 'sc' + eventId;
                    $('#' + id).css({"box-shadow": ".3em .3em .1em #888888"});
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
            eventsFactory.stopAttendingClass(info, function(data){
                refreshUser(); 
            });
        }//END OF ELSE IF

    }//END OF ELSE
  }

    $scope.getButtonsInfo = function(mId){
	  setTimeout(function(){ 
	  	if($rootScope.user){
        // console.log($rootScope.user)
          for(var i = 0; i < $rootScope.user._class_favorites.length; i++){
              if(mId == $rootScope.user._class_favorites[i]._id){
                  var id = 'sc' + mId;
                  $('#' + id).css({"box-shadow" : "inset .2em .2em .1em #888888"});
              };
          };
          for(var i = 0; i < $rootScope.user._class_attending.length; i++){
              if(mId == $rootScope.user._class_attending[i]._id){
                  var id = 'ac' + mId;
                  $('#' + id).css({"box-shadow" : "inset .2em .2em .1em #888888"});
              };
          };
      };

	  }, 50);
      
    };

  function refreshUser() {

      eventsFactory.getUser($rootScope.user.fb_id, function(data){
          $scope.class_attending = data.data._class_attending;
          $scope.class_favorites = data.data._class_favorites;
          $rootScope.user = data.data;
      }); 
  }

  //FIND MORE ELEGANT SOLUTION TO REMOVE MULTIPLE VERIONS
  setTimeout(function(){
    $rootScope.multipleVersions = false;
    // console.log('DONE!')
  },10000);

  


});