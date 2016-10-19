myApp.controller('profileController', function($scope, eventsFactory, $location, $http, $rootScope, $window){

  if(!$rootScope.user){
    $location.url('/')
  }
  else {


  eventsFactory.getUser($rootScope.user.id, function(data){
    // console.log('BACK getUser profile controller,', data);
    $scope.favorites = data.data._favorites;
    $scope.attending = data.data._attending;
    // console.log($scope.attending, 'attending')
  })

  $scope.now = moment().add(-1,'days').format();

  $scope.choice = 'favorites';
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
      // console.log('attending this event: ', eventId, 'user:', $rootScope.user.name)
      var datos = {
        eventId: eventId,
        fb_id: $rootScope.user.id,
      }
      eventsFactory.attendEvent(datos, function(data){
          // console.log('back in frontend controller',data);
          eventsFactory.getUser($rootScope.user.id, function(data){
            // console.log('get favorites controller,', data);
            $scope.favorites = data.data._favorites;
            $scope.attending = data.data._attending;
            // console.log($scope.attending, 'attending')
          });  
      });
    }//END OF ELSE
  }

  $scope.isSaved = function(mId){
    if($rootScope.user){
      for(var i = 0; i < $scope.favorites.length; i++){
        if(mId == $scope.favorites[i]._id){
          return true;
        }
      }
    }
    return false;
  }

  $scope.isAttending = function(mId){
    // console.log('checking milonga:', mId)
    if($rootScope.user){
      for(var i = 0; i < $scope.attending.length; i++){
        // console.log('comparing:', mId, $scope.attending[i]._id)
        if(mId == $scope.attending[i]._id){
          // console.log('returning true')
          return true;
        }
      }
    }
    // console.log('returning FALSE')
    return false;
  }

  $scope.stopAttending = function(mId){
    var info = {
      eventId: mId,
      userId: $rootScope.user.id
    }
    eventsFactory.stopAttending(info, function(data){
        // console.log('BACK stopAttending profile controller,', data);
        eventsFactory.getUser($rootScope.user.id, function(dat){
            // console.log('get favorites controller,', dat);
            $scope.attending = dat.data._attending;
            // console.log($scope.attending, 'attending')
        });  
    });
  };

  $scope.stopSaving = function(mId){
    var info = {
      eventId: mId,
      userId: $rootScope.user.id
    }
    eventsFactory.stopSaving(info, function(data){
        // console.log('BACK stopSaving profile controller,', data);
        eventsFactory.getUser($rootScope.user.id, function(dat){
            // console.log('get favorites controller,', dat);
            $scope.favorites = dat.data._favorites;
            // console.log($scope.favorites, 'favorites')
        }); 
    });
  };







}

});