myApp.controller('profileController', function($scope, eventsFactory, $location, $http, $rootScope, $window){

  if(!$rootScope.user){
    $location.url('/')
  }
  else {


  eventsFactory.getUser($rootScope.user.fb_id, function(data){
    // console.log('BACK getUser profile controller,', data);
    $scope.favorites = data.data._favorites;
    $scope.attending = data.data._attending;
    $scope.class_favorites = data.data._class_favorites;
    $scope.class_attending = data.data._class_attending;
    // console.log($scope.attending, 'attending')
  })

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
            });
        }
        else if(check == true){
            $('#' + id).css({'border': '1px solid black'});
            var info = {
              eventId: eventId,
              userId: $rootScope.user.fb_id
            }
            eventsFactory.stopAttending(info, function(data){
                eventsFactory.getUser($rootScope.user.fb_id, function(data){
                    $rootScope.user = data.data;
                    $scope.attending = data.data._attending;
                });  
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
            });
        }
        else if(check == true){
            $('#' + id).css({'border': '1px solid black'});
            var info = {
              eventId: eventId,
              userId: $rootScope.user.fb_id
            }
            eventsFactory.stopAttendingClass(info, function(data){
                eventsFactory.getUser($rootScope.user.fb_id, function(data){
                    $rootScope.user = data.data;
                    $scope.class_attending = data.data._class_attending;
                });  
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
                eventsFactory.getUser($rootScope.user.fb_id, function(dat){
                    // console.log('get favorites controller,', dat);
                    $scope.favorites = dat.data._favorites;
                    $rootScope.user = dat.data;
                }); 
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
                eventsFactory.getUser($rootScope.user.fb_id, function(dat){
                    // console.log('get favorites controller,', dat);
                    $scope.class_favorites = dat.data._class_favorites;
                    $rootScope.user = dat.data;
                }); 
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
        eventsFactory.getUser($rootScope.user.fb_id, function(dat){
            // console.log('get favorites controller,', dat);
            $scope.attending = dat.data._attending;
            $scope.favorites = dat.data._favorites;
            $rootScope.user = dat.data;
            // console.log($scope.attending, 'attending')
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
        eventsFactory.getUser($rootScope.user.fb_id, function(dat){
            // console.log('get favorites controller,', dat);
            $scope.attending = dat.data._attending;
            $scope.favorites = dat.data._favorites;
            $scope.class_attending = dat.data._class_attending;
            $scope.class_favorites = dat.data._class_favorites;
            $rootScope.user = dat.data;
            // console.log($scope.attending, 'attending')
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
        eventsFactory.getUser($rootScope.user.fb_id, function(dat){
            // console.log('get favorites controller,', dat);
            $scope.favorites = dat.data._favorites;
            $scope.attending = dat.data._attending;
            $rootScope.user = dat.data;
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
        eventsFactory.getUser($rootScope.user.fb_id, function(dat){
            // console.log('get favorites controller,', dat);
            $scope.attending = dat.data._attending;
            $scope.favorites = dat.data._favorites;
            $scope.class_attending = dat.data._class_attending;
            $scope.class_favorites = dat.data._class_favorites;
            $rootScope.user = dat.data;
        }); 
    });
  };







}

});