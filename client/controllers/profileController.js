myApp.controller('profileController', function($scope, eventsFactory, $location, $http, $rootScope, $window){

  if(!$rootScope.user){
    $location.url('/')
  }
  else {
  $scope.refreshUser(); 

  $window.scrollTo(0, 0);


  $scope.now = moment().add(-1,'days').format();

  $scope.choice = 'attending';
  $scope.choose = function(whichOne){
    $scope.choice = whichOne;
    // console.log('scope.choice', $scope.choice)
  }

  $scope.openInMaps = function(addr) {
    var address = 
          addr.st_number 
        + addr.st_name
        + addr.city
        + addr.state;
    $window.open("http://maps.google.com/?q=" + address);
  }

  $scope.openFaceProfile = function(added_by_id) {
     $window.open('https://www.facebook.com/' + added_by_id, '_blank');
  };

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
            $('#' + id).css({'border': '0'});
            // console.log('attending this event: ', eventId, 'user:', $rootScope.user.name)
            var datos = {
              eventId: eventId,
              fb_id: $rootScope.user.fb_id,
            }
            eventsFactory.attendEvent(datos, function(data){
                // console.log('back in frontend controller',data);
                $scope.stopSaving(eventId); 
                $('#successMsg').html('Successfully moved milonga to Attending Events')
                setTimeout(function(){
                  $('#successMsg').html('')
                },3000)

            });
        }
        else if(check == true){
            $('#' + id).css({'border': '1px solid black'});
            var info = {
              eventId: eventId,
              userId: $rootScope.user.fb_id
            }
            eventsFactory.stopAttending(info, function(data){
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
            $('#' + id).css({'border': '0'});
            // console.log('attending this event: ', eventId, 'user:', $rootScope.user.name)
            var datos = {
              eventId: eventId,
              fb_id: $rootScope.user.fb_id,
            }
            eventsFactory.attendClass(datos, function(data){
                // console.log('back in frontend controller',data);
                $scope.stopSavingClass(eventId); 
                $('#successMsg').html('Successfully moved class to Attending Events')
                setTimeout(function(){
                  $('#successMsg').html('')
                },3000)
            });
        }
        else if(check == true){
            $('#' + id).css({'border': '1px solid black'});
            var info = {
              eventId: eventId,
              userId: $rootScope.user.fb_id
            }
            eventsFactory.stopAttendingClass(info, function(data){
                refreshUser();  
            });
        }//END OF ELSE IF

    }//END OF ELSE
  }

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
            $('#' + id).css({'border': '0'});
            var datos = {
              eventId: eventId,
              fb_id: $rootScope.user.fb_id,
            }
            eventsFactory.likeEvent(datos, function(data){
                // console.log('back in frontend controller',data);   
                $scope.stopAttending(eventId);
                $('#successMsg').html('Successfully moved milonga to Saved Events')
                setTimeout(function(){
                  $('#successMsg').html('')
                },3000)
            });
        }
        else if(check == true){
            $('#' + id).css({'border': '1px solid black'});
            var info = {
                eventId: eventId,
                userId: $rootScope.user.fb_id
            }
            eventsFactory.stopSaving(info, function(data){
                // console.log('BACK stopSaving profile controller,', data);
                refreshUser(); 
            });
        }//END OF ELSE IF

    }//END OF ELSE
  }

  $scope.saveClass = function(eventId) {
    if(!$rootScope.user){
      // console.log('!Rosotscope user')
      $('#loginModal').modal();
    }
    else {
        var check = false;
        var id = 'sc' + eventId;
        for(var i = 0; i < $rootScope.user._class_favorites.length; i++){
            if(eventId == $rootScope.user._class_favorites[i]._id){
                check = true;
            };
        };

        if(check == false){
            $('#' + id).css({'border': '0'});
            var datos = {
              eventId: eventId,
              fb_id: $rootScope.user.fb_id,
            }
            eventsFactory.likeClass(datos, function(data){
                // console.log('back in frontend controller',data);   
                $scope.stopAttendingClass(eventId);
                $('#successMsg').html('Successfully moved class to Saved Events')
                setTimeout(function(){
                  $('#successMsg').html('')
                },3000)

            });
        }
        else if(check == true){
            $('#' + id).css({'border': '1px solid black'});
            var info = {
                eventId: eventId,
                userId: $rootScope.user.fb_id
            }
            eventsFactory.stopSavingClass(info, function(data){
                // console.log('BACK stopSaving profile controller,', data);
                refreshUser(); 
            });
        }//END OF ELSE IF

    }//END OF ELSE
  }

  $scope.stopAttending = function(mId){
    var info = {
      eventId: mId,
      fb_id: $rootScope.user.fb_id
    }
    eventsFactory.stopAttending(info, function(data){
        // console.log('BACK stopAttending profile controller,', data);
        eventsFactory.getUser($rootScope.user.fb_id, function(data){
            refreshUser();
        });  
    });
  };

  $scope.stopAttendingClass = function(mId){
    var info = {
      eventId: mId,
      fb_id: $rootScope.user.fb_id
    }
    eventsFactory.stopAttendingClass(info, function(data){
        // console.log('BACK stopAttending profile controller,', data);
        eventsFactory.getUser($rootScope.user.fb_id, function(data){
            refreshUser();
        });  
    });
  };

  $scope.stopSaving = function(mId){
    var info = {
      eventId: mId,
      fb_id: $rootScope.user.fb_id
    }
    eventsFactory.stopSaving(info, function(data){
        // console.log('BACK stopSaving profile controller,', data);
        eventsFactory.getUser($rootScope.user.fb_id, function(data){
            refreshUser();
        }); 
    });
  };

  $scope.stopSavingClass = function(mId){
    var info = {
      eventId: mId,
      fb_id: $rootScope.user.fb_id
    }
    eventsFactory.stopSavingClass(info, function(data){
        // console.log('BACK stopSaving profile controller,', data);
        refreshUser();
    });
  };


  function refreshUser() {

      eventsFactory.getUser($rootScope.user.fb_id, function(data){
          $rootScope.user = data.data;
          $scope.favorites = data.data._favorites;
          $scope.attending = data.data._attending;
          $scope.favorites = $scope.favorites.concat(data.data._class_favorites)
          $scope.attending = $scope.attending.concat(data.data._class_attending)
      }); 
  }



} // END OF ELSE

});