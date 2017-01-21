myApp.controller('indexController', function($scope, eventsFactory, forumFactory, $cookies, $location, $http, $rootScope, $window){

  $scope.pos;
  var st;
  var range = 50;
  $rootScope.search = {};
  $rootScope.search.what = 'Milongas'

  
  $scope.milongas = {
    today: [],
    tomorrow: [],
    day_after: [],
  };

  if($rootScope.user && $rootScope.user.city_preference){

      $scope.pos = {
        lat: $rootScope.user.city_preference.coordinates.lat,
        lng: $rootScope.user.city_preference.coordinates.lng,
      }
      var st = $rootScope.user.city_preference.state;
      $rootScope.search.city = $rootScope.user.city_preference.city;
  }

  else if (($rootScope.user && !$rootScope.user.city_preference) || !$rootScope.user){
      if (navigator.geolocation) {
          $rootScope.search.city = 'Your current location';
          navigator.geolocation.getCurrentPosition(function(position) {

                $scope.pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };


                info.pos = $scope.pos;
          })
      }
      else{
        $scope.pos = {
          lat: 37.7749295,
          lng: -122.41941550000001,
        }
        var st = 'CA'
        $rootScope.search.city = 'San Francisco, CA, USA';
      }

  }

  // else if($scope.userCookie.cityPrefCity){
  //   // console.log('city from cookie')
  //     var pos = {
  //       lat: $scope.userCookie.cityPrefLat,
  //       lng: $scope.userCookie.cityPrefLng,
  //     }
  //     var st = $scope.userCookie.cityPrefState;
  //     $rootScope.search.city = $scope.userCookie.cityPrefCity;

  // }

  var info = {
      range: range,
      pos: $scope.pos,
      state: {state: st},
      dates: {
        today: moment($rootScope.search.date).format('YYYY MM DD'),
        tomorrow: moment($rootScope.search.date).add(1, 'days').format('YYYY MM DD'),
        day_after: moment($rootScope.search.date).add(2, 'days').format('YYYY MM DD')
      },
  };


  eventsFactory.getMilongas(info, function(data){
      $scope.milongas = data;
      setErrorMsg();
  })


  //AS SOON AS POS GETS DEFINED BY GEOLOCATION, GET MILONGAS AGAIN
  $scope.$watch("pos", function(newValue, oldValue) {
      eventsFactory.getMilongas(info, function(data){
          $scope.milongas = data;
          setErrorMsg();
      })
  });

  


  $scope.$watch("search.range", function(newValue, oldValue) {
    $scope.sorryMsg = false;
    range = newValue
    info.range = range;

    if ($scope.search.what == 'Classes') {
      // console.log('WE ARE SEARCHING WITHIN CLASSES')
      eventsFactory.getClasses(info, function(data){
          $scope.milongas = data;
          setErrorMsg(); 
      })
    }
    else if ( $scope.search.what == 'Milongas' || !$scope.search.what){
      // console.log('WE ARE SEARCHING WITHIN MILONGAS')
      eventsFactory.getMilongas(info, function(data){
          $scope.milongas = data;  
          setErrorMsg();
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
          setErrorMsg();
      })
    }
  });




  $rootScope.$watch("search.city", function(newValue, oldValue) {
    $scope.sorryMsg = false;
    // console.log(newValue);
    if(newValue != oldValue && newValue != null){

        //if the user typed in a new city, save it to preferences
        if ($rootScope.search.city && $rootScope.search.city.geometry) {
            // console.log($rootScope.search.city)
            $scope.pos = {
              lat: $rootScope.search.city.geometry.location.lat(),
              lng: $rootScope.search.city.geometry.location.lng()
            };
            st = $rootScope.search.city.address_components[2].short_name;
            info.pos =  $scope.pos;
            info.state = {state: st};
            info.city = $rootScope.search.city.formatted_address;


            if ($scope.search.what == 'Classes') {
              // console.log('WE ARE SEARCHING WITHIN CLASSES')
              eventsFactory.getClasses(info, function(data){
                  $scope.milongas = data;
                  setErrorMsg();

                  //update city in the cookie and user_preference
                  // $cookies.put('cityPrefLat', pos.lat);
                  // $cookies.put('cityPrefLng', pos.lng);
                  // $cookies.put('cityPrefState', st);
                  // $cookies.put('cityPrefCity', $rootScope.search.city.formatted_address);


                  if($rootScope.user){
                      info.userId = $rootScope.user.fb_id;
                      eventsFactory.updateUsersCity(info, function(dat){
                      });
                  };
              })
            }

            else if ( $scope.search.what == 'Milongas' || !$scope.search.what){
              // console.log('WE ARE SEARCHING WITHIN MILONGAS')
              eventsFactory.getMilongas(info, function(data){
                  $scope.milongas = data;                  
                  setErrorMsg(); 

                  // $cookies.put('cityPrefLat', pos.lat);
                  // $cookies.put('cityPrefLng', pos.lng);
                  // $cookies.put('cityPrefState', st);
                  // $cookies.put('cityPrefCity', $rootScope.search.city.formatted_address);


                  if($rootScope.user){
                      info.userId = $rootScope.user.fb_id;
                      eventsFactory.updateUsersCity(info, function(dat){
                      });
                  };
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
                  setErrorMsg();

                  // $cookies.put('cityPrefLat', pos.lat);
                  // $cookies.put('cityPrefLng', pos.lng);
                  // $cookies.put('cityPrefState', st);
                  // $cookies.put('cityPrefCity', $rootScope.search.city.formatted_address);


                  if($rootScope.user){
                      info.userId = $rootScope.user.fb_id;
                      eventsFactory.updateUsersCity(info, function(dat){
                      });
                  };
              })
            }
        }

    };
    
  });

  $scope.$watch("search.date", function(newValue, oldValue) {
    newValue = moment(newValue).format('YYYY MM DD');
    var newValue2 = moment(newValue).add(1, 'days').format('YYYY MM DD');
    var newValue3 = moment(newValue).add(2, 'days').format('YYYY MM DD');
    // console.log('NEW DATE:',newValue)
    info.dates = {
        today: newValue,
        tomorrow: newValue2,
        day_after: newValue3
    }
    $scope.sorryMsg = false;

    if ($scope.search.what == 'Classes') {
      // console.log('WE ARE SEARCHING WITHIN CLASSES')
      eventsFactory.getClasses(info, function(data){
          $scope.milongas = data;
          setErrorMsg();
      })
    }
    else if ( $scope.search.what == 'Milongas' || !$scope.search.what){
      // console.log('WE ARE SEARCHING WITHIN MILONGAS')
      eventsFactory.getMilongas(info, function(data){
          $scope.milongas = data;
                  // console.log($scope.milongas);
          setErrorMsg();
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
          setErrorMsg();
      })
    }
  });


  // $rootScope.what = 'Milongas'
  $rootScope.$watch("search.what", function(newValue, oldValue) {
    $scope.sorryMsg = false;
    // console.log('inside what', $rootScope.search.what)
    //A WAY TO IMPROVE THIS QUERING FOR ALL OF THEM AND HAVE THEM 
    //IN DIFFERENT VARIABLES SO WE ONLY PUT IN MILONGAS WHAT WE NEED
    //IMPROVEMENT FOR LATER, TO NOT HAVE TO QUERY SO MUCH UNNESESARY
    if (newValue == 'Classes') {
      // console.log('new value is equal to classes')
      eventsFactory.getClasses(info, function(data){
          $scope.milongas = data;   
          setErrorMsg();
      })
    }
    else if ( newValue == 'Milongas'){
      // console.log('new value is equal to milongas')
      eventsFactory.getMilongas(info, function(data){
          $scope.milongas = data;   
          setErrorMsg();
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
          setErrorMsg();
      })
    }

  });

var mapsInfo = [];

  $scope.getMapInfo = function(mId, addr) {
    // console.log('inside get map info', addr);

    for(var i = 0; i < mapsInfo.length; i++){
        if(mapsInfo[i] == mId) {
            // console.log('INSIDE IF', mapsInfo[i])
            return;
        }
    }

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
        // console.log('RESPONSE',response);
        document.getElementById('map_canvas_' + mId).style.display="block";
        initializeMap(response, mId);
        mapsInfo.push(mId);
        // console.log(mapsInfo)
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
                    $('#status'+ eventId).html('Event saved');
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
                $('#status'+ eventId).html('');
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
                    console.log('ID TO START ATTENDING',id)
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
                    $('#status'+ eventId).html('Attending event');
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
                $('#status'+ eventId).html('');
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
                    $('#status'+ eventId).html('Event saved');
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
                $('#status'+ eventId).html('');
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
                $('#status'+ eventId).html('Attending event');   
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
                $('#status'+ eventId).html('');
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
    // console.log('MAP OPTIONS', myOptions)
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

  

  $scope.getButtonsInfo = function(mId){

      if($rootScope.user){
        // console.log($rootScope.user)
          for(var i = 0; i < $rootScope.user._favorites.length; i++){
              if(mId == $rootScope.user._favorites[i]._id){
                  var id = 's' + mId;
                  $('#' + id).css({"box-shadow" : "inset .2em .2em .1em #888888"});
                  $('#status' + mId).html('Event saved');
              };
          };
          for(var i = 0; i < $rootScope.user._attending.length; i++){
              if(mId == $rootScope.user._attending[i]._id){
                  var id = 'a' + mId;
                  $('#' + id).css({"box-shadow" : "inset .2em .2em .1em #888888"});
                  $('#status' + mId).html('Attending event')
              };
          };
          for(var i = 0; i < $rootScope.user._class_favorites.length; i++){
              if(mId == $rootScope.user._class_favorites[i]._id){
                  var id = 'sc' + mId;
                  $('#' + id).css({"box-shadow" : "inset .2em .2em .1em #888888"});
                  $('#status' + mId).html('Event saved');
              };
          };
          for(var i = 0; i < $rootScope.user._class_attending.length; i++){
              if(mId == $rootScope.user._class_attending[i]._id){
                  var id = 'ac' + mId;
                  $('#' + id).css({"box-shadow" : "inset .2em .2em .1em #888888"});
                  $('#status' + mId).html('Attending event')
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

  var getEditDistance = function(a, b){
      if(a.length == 0) return b.length; 
      if(b.length == 0) return a.length; 

      var matrix = [];

      // increment along the first column of each row
      var i;
      for(i = 0; i <= b.length; i++){
        matrix[i] = [i];
      }

      // increment each column in the first row
      var j;
      for(j = 0; j <= a.length; j++){
        matrix[0][j] = j;
      }

      // Fill in the rest of the matrix
      for(i = 1; i <= b.length; i++){
        for(j = 1; j <= a.length; j++){
          if(b.charAt(i-1) == a.charAt(j-1)){
            matrix[i][j] = matrix[i-1][j-1];
          } else {
            matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                    Math.min(matrix[i][j-1] + 1, // insertion
                                             matrix[i-1][j] + 1)); // deletion
          }
        }
      }

      return matrix[b.length][a.length];
    };

    function setErrorMsg(){
      if($scope.milongas.today.length == 0) {
          // console.log($scope.milongas.today.length)
          $scope.sorryMsg = true;
      }
    }



    
  // THIS IS INCOMPLETE CODE TO ATTACH DAY NAME BEFORE DATE.
  // var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  
  // var d = new Date();

  // $scope.today = weekday[d.getDay()];
  // $scope.tomorrow = weekday[d.getDay()+1];
  // $scope.day_after = weekday[d.getDay()+2];


})

