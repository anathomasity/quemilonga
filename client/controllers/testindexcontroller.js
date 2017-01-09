// if no results for date chosen but yes for one or 2 days later
//display message 'didn't find for that date but...'

//Facebook share button on SHOW event pages and general map pages

//editClass and editMilonga partial, are not pre populating the class with the current teachers, and CLASSONLY afer editting, is 
//making a copy of the class into the teacher's attending events array

// IN SHOW MILONGA PAGE, MILONGA BACK COLOR SHOUld be green not pink

//see how to get users facebook profile picture

//fix mailto from browser -- contact and report


//display messages of confirmation: NG FLASH
// 'class succesfully saved, 
// class now attending, 
// class now saving
// this is your new class on show class page
// this is your new milonga // on show milonga page

//after adding multiple milongas, redirect to a show page of a list of them



myApp.controller('indexController', function($scope, eventsFactory, $cookies, $location, $http, $rootScope, $window){

  var state;
  var range = 50;
  $rootScope.search = {};

  if($rootScope.user){
    refreshUser();
  }
  

  if(!$rootScope.user || !$rootScope.user.city_preference) {
      var pos = {
        lat: 37.7749295,
        lng: -122.41941550000001,
      }
      var st = 'CA'
      $rootScope.search.city = 'San Francisco, CA, USA';
  }
  else{
      // if ($rootScope.search.city && $rootScope.search.city !== 'San Francisco, CA, USA'){
      //     alert('hello');
      // }

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
      // if(!$rootScope.user){
      //   return;
      // }
      // console.log('ABOUT TO ENTERE FOR')
      // for(var i = 0; i < $rootScope.user._attending.length; i++) {
      //   var id = 'a' + $rootScope.user._attending[i]._id;
      //   $('#' + id).css({'cursor': 'not-allowed', 'border': '0'});
      //   console.log('HERE AT ATTENDING')
      // }
      // for(var i = 0; i < $rootScope.user._favorites.length; i++) {
      //   var id = 's' + $rootScope.user._favorites[i]._id;
      //   $('#' + id).css({'cursor': 'not-allowed', 'border': '0'});
      //   console.log('HERE AT SAVED')
      // }
  });

  $scope.$watch("search.range", function(newValue, oldValue) {
    range = newValue
    info.range = range;
    // eventsFactory.getMilongas(info, function(data){
    //     $scope.milongas = data;   
    // })


    if ($scope.search.what == 'Classes') {
      // console.log('WE ARE SEARCHING WITHIN CLASSES')
      eventsFactory.getClasses(info, function(data){
          $scope.milongas = data;   
      })
    }
    else if ( $scope.search.what == 'Milongas' || !$scope.search.what){
      // console.log('WE ARE SEARCHING WITHIN MILONGAS')
      eventsFactory.getMilongas(info, function(data){
          $scope.milongas = data;   
      })
    }
    else if ( $scope.search.what == 'All'){
      // console.log('WE ARE SEARCHING ALL')
      eventsFactory.getMilongas(info, function(data){
          $scope.milongas = data;   
      })
      eventsFactory.getClasses(info, function(data){
          for (x in data.today){
              $scope.milongas.today.push(data.today[x]);
          }
          for (x in data.tomorrow){
              $scope.milongas.tomorrow.push(data.tomorrow[x]);
          }
          for (x in data.day_after){
              $scope.milongas.day_after.push(data.day_after[x]);
          }
          // console.log($scope.milongas)
      })
    }
  });

  $rootScope.$watch("search.city", function(newValue, oldValue) {
    if(newValue != oldValue && newValue != null){

        if ($rootScope.search.city && $rootScope.search.city.geometry) {
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

    if ($scope.search.what == 'Classes') {
      // console.log('WE ARE SEARCHING WITHIN CLASSES')
      eventsFactory.getClasses(info, function(data){
          $scope.milongas = data;   
      })
    }
    else if ( $scope.search.what == 'Milongas' || !$scope.search.what){
      // console.log('WE ARE SEARCHING WITHIN MILONGAS')
      eventsFactory.getMilongas(info, function(data){
          $scope.milongas = data;   
      })
    }
    else if ( $scope.search.what == 'All'){
      // console.log('WE ARE SEARCHING ALL')
      eventsFactory.getMilongas(info, function(data){
          $scope.milongas = data;   
      })
      eventsFactory.getClasses(info, function(data){
          for (x in data.today){
              $scope.milongas.today.push(data.today[x]);
          }
          for (x in data.tomorrow){
              $scope.milongas.tomorrow.push(data.tomorrow[x]);
          }
          for (x in data.day_after){
              $scope.milongas.day_after.push(data.day_after[x]);
          }
          // console.log($scope.milongas)
      })
    }
  });


  // $rootScope.what = 'Milongas'
  $rootScope.$watch("search.what", function(newValue, oldValue) {
    // console.log('inside what', $rootScope.search.what)
    //A WAY TO IMPROVE THIS QUERING FOR ALL OF THEM AND HAVE THEM 
    //IN DIFFERENT VARIABLES SO WE ONLY PUT IN MILONGAS WHAT WE NEED
    //IMPROVEMENT FOR LATER, TO NOT HAVE TO QUERY SO MUCH UNNESESARY
    if (newValue == 'Classes') {
      // console.log('new value is equal to classes')
      eventsFactory.getClasses(info, function(data){
          $scope.milongas = data;   
      })
    }
    else if ( newValue == 'Milongas'){
      // console.log('new value is equal to milongas')
      eventsFactory.getMilongas(info, function(data){
          $scope.milongas = data;   
      })
    }
    else if ( newValue == 'All'){
      // console.log('new value is equal to all')
      eventsFactory.getMilongas(info, function(data){
          $scope.milongas = data;   
      })
      eventsFactory.getClasses(info, function(data){
          for (x in data.today){
              $scope.milongas.today.push(data.today[x]);
          }
          for (x in data.tomorrow){
              $scope.milongas.tomorrow.push(data.tomorrow[x]);
          }
          for (x in data.day_after){
              $scope.milongas.day_after.push(data.day_after[x]);
          }
          // console.log($scope.milongas)
      })
    }

  });

  $scope.getMapInfo = function(mId, addr) {
    // console.log('inside get map info', addr);
    var address = 
          addr.st_number + '+'
        + addr.st_name + '+'
        + addr.city + '+'
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
          addr.st_number + '+'
        + addr.st_name + '+'
        + addr.city + '+'
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

  $scope.getButtonsInfo = function(mId){
      if($rootScope.user){
        // console.log($rootScope.user)
          for(var i = 0; i < $rootScope.user._favorites.length; i++){
              if(mId == $rootScope.user._favorites[i]._id){
                  var id = 's' + mId;
                  $('#' + id).css({"box-shadow" : "inset .2em .2em .1em #888888"});
              };
          };
          for(var i = 0; i < $rootScope.user._attending.length; i++){
              if(mId == $rootScope.user._attending[i]._id){
                  var id = 'a' + mId;
                  $('#' + id).css({"box-shadow" : "inset .2em .2em .1em #888888"});
              };
          };
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
  };

  function refreshUser() {

      eventsFactory.getUser($rootScope.user.fb_id, function(data){
          $scope.attending = data.data._attending;
          $scope.favorites = data.data._favorites;
          $scope.class_attending = data.data._class_attending;
          $scope.class_favorites = data.data._class_favorites;
          $rootScope.user = data.data;
      }); 
  }




    
  // THIS IS INCOMPLETE CODE TO ATTACH DAY NAME BEFORE DATE.
  // var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  
  // var d = new Date();

  // $scope.today = weekday[d.getDay()];
  // $scope.tomorrow = weekday[d.getDay()+1];
  // $scope.day_after = weekday[d.getDay()+2];


})

