myApp.controller('indexController', function($scope, eventsFactory, $location, $http, $rootScope, $window){

  var state;
  var range = 50;
  $rootScope.search = {};

  if(!$rootScope.user || !$rootScope.user.city_preference) {
      var pos = {
        lat: 37.7749295,
        lng: -122.41941550000001,
      }
      var st = 'CA'
      $rootScope.search.city = 'San Francisco, CA, USA';
  }
  else{
      var pos = {
        lat: $rootScope.user.city_preference.coordinates.lat,
        lng: $rootScope.user.city_preference.coordinates.lng,
      }
      var st = $rootScope.user.city_preference.state;
      $rootScope.search.city = $rootScope.user.city_preference.city;
  }
  
  

  $scope.milongas = {
    today: [],
    tomorrow: [],
    day_after: [],
  };

  var info = {
      range: range,
      pos: pos,
      state: {state: st},
  };


  eventsFactory.getMilongas(info, function(data){
      $scope.milongas = data;  
  })

  $scope.$watch("user", function(newValue, oldValue) {
      // console.log('hello')
      for(var i = 0; i < $rootScope.user._attending.length; i++) {
        var id = 'a' + $rootScope.user._attending[i]._id;
        $('#' + id).css({'cursor': 'not-allowed', 'border': '0'});
      }
      for(var i = 0; i < $rootScope.user._favorites.length; i++) {
        var id = 's' + $rootScope.user._favorites[i]._id;
        $('#' + id).css({'cursor': 'not-allowed', 'border': '0'});
      }
  });

  $scope.$watch("search.range", function(newValue, oldValue) {
    range = newValue
    info.range = range;
    eventsFactory.getMilongas(info, function(data){
        $scope.milongas = data;   
    })
  });

  $rootScope.$watch("search.city", function(newValue, oldValue) {
    if(newValue != oldValue){

        if ($rootScope.search.city.geometry) {
            pos = {
              lat: $rootScope.search.city.geometry.location.lat(),
              lng: $rootScope.search.city.geometry.location.lng()
            };
            st = $rootScope.search.city.address_components[2].short_name;
            info.pos = pos;
            info.state = {state: st}
            info.city = $rootScope.search.city.formatted_address

            // console.log('scopesearchcity:', info.city)


            eventsFactory.getMilongas(info, function(data){
                // console.log('BACK WITH MILONGAS:', data)
                $scope.milongas = data;

                if($rootScope.user){
                    // console.log('Rosotscopeuser', $rootScope.user)

                    info.userId = $rootScope.user.fb_id;
                    eventsFactory.updateUsersCity(info, function(dat){
                        // console.log('UPDATED USERS CITY CONTROLLER', dat)
                    });
                };
            });
        }
        else {
            // console.log('city_preference',$rootScope.city_preference)
            pos = {
              lat: $rootScope.city_preference.coordinates.lat,
              lng: $rootScope.city_preference.coordinates.lng
            };
            st = $rootScope.city_preference.state;
            info.pos = pos;
            info.state = {state: st}
            eventsFactory.getMilongas(info, function(data){
                $scope.milongas = data;
            });
        };
    };
    
  });

  $scope.$watch("search.date", function(newValue, oldValue) {
    info.state.date = newValue;
    eventsFactory.getMilongas(info, function(data){
        $scope.milongas = data;    
    })
  });

  $scope.getMapInfo = function(mId, addr) {
    // console.log('inside get map info', addr);
    var address = 
          addr.st_number 
        + addr.st_name
        + addr.city
        + addr.state;
    // console.log('ADDRESS', address)
    $http.get("https://maps.googleapis.com/maps/api/geocode/json?address="
    + address
    + "&key=AIzaSyCVt2_VyislvhmEKm-DzrFwfarQaLrTs4Q")

    .then(function(response){ 
      // console.log(response);
      document.getElementById('map_canvas_' + mId).style.display="block";
      initializeMap(response, mId);
    });
  }

  $scope.saveEvent = function(eventId) {
    if(!$rootScope.user){
      // console.log('!Rosotscope user')
      $('#loginModal').modal();
    }
    else {
      var id = 's' + eventId;
      $('#' + id).css({'cursor': 'not-allowed', 'border': '0'});
      // console.log('liking this event: ', eventId, 'user:', $rootScope.user.name)
      var datos = {
        eventId: eventId,
        fb_id: $rootScope.user.fb_id,
      }
      eventsFactory.likeEvent(datos, function(data){
          // console.log('back in frontend controller',data);   
          eventsFactory.getUser($rootScope.user.fb_id, function(data){
            // console.log('get favorites controller,', data);
            $rootScope.user = data.data;
            $scope.favorites = data.data._favorites;
          }); 
      });
    }//END OF ELSE
  }

  $scope.attendEvent = function(eventId) {
    if(!$rootScope.user){
      // console.log('!Rosotscope user')
      $('#loginModal').modal();
    }
    else {
      var id = 'a' + eventId;
      $('#' + id).css({'cursor': 'not-allowed', 'border': '0'});
      // console.log('attending this event: ', eventId, 'user:', $rootScope.user.name)
      var datos = {
        eventId: eventId,
        fb_id: $rootScope.user.fb_id,
      }
      eventsFactory.attendEvent(datos, function(data){
          // console.log('back in frontend controller',data);
          eventsFactory.getUser($rootScope.user.fb_id, function(data){
            // console.log('get favorites controller,', data);
            $rootScope.user = data.data;
            $scope.attending = data.data._attending;
            // console.log($scope.attending, 'attending')
          });  
      });
    }//END OF ELSE
  }

  function initializeMap(response, mId) {
    // create the map
    var myOptions = {
      zoom: 12,
      center: new google.maps.LatLng(response.data.results[0].geometry.location.lat, response.data.results[0].geometry.location.lng),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(document.getElementById("map_canvas_" + mId),myOptions);
    var marker = new google.maps.Marker({
        position: myOptions.center,
    });
    marker.setMap(map);
  }

  $scope.autocompleteOptions = {
    types: ['(cities)'],
  }

  $scope.options = {
    showWeeks: false
  };


  $scope.openInMaps = function(addr) {
    var address = 
          addr.st_number 
        + addr.st_name
        + addr.city
        + addr.state;
    $window.open("http://maps.google.com/?q=" + address);
  }

  $scope.anyMilonga = function() {
      if ($scope.milongas.today.length < 1 && $scope.milongas.tomorrow.length < 1 && $scope.milongas.day_after.length < 1){
          return false;
      }
      return true;
  }

  $scope.openFaceProfile = function(added_by_id) {
     $window.open('https://www.facebook.com/' + added_by_id, '_blank');
  };

  $scope.isSaved = function(mId){
    if($rootScope.user){
      for(var i = 0; i < $rootScope.user._favorites.length; i++){
        if(mId == $rootScope.user._favorites[i]._id){
          return true;
        }
      }
    }
    return false;
  }

  $scope.isAttending = function(mId){
    if($rootScope.user){
      for(var i = 0; i < $rootScope.user._attending.length; i++){
        if(mId == $rootScope.user._attending[i]._id){
          return true;
        }
      }
    }
    return false;
  }

})