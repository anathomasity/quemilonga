myApp.controller('indexController', function($scope, eventsFactory, $location, $http, $rootScope, $window){

  console.log('USER is: ',$rootScope.user);

  var user_position;
  var user_state;
  var pos;
  var st;
  var info;
  var state;
  var range = 50;
  $scope.milongas = {
    today: [],
    tomorrow: [],
    day_after: [],
  };
  $scope.map = [];

  $scope.autocompleteOptions = {
        types: ['(cities)'],
    }

  $scope.search = {};
  $scope.search.city = 'My Current Location';
  $scope.setCurrentLocation = function(){
    $scope.search.city = 'My Current Location';
  }

  $scope.anyMilonga = function() {
      if ($scope.milongas.today.length < 1 && $scope.milongas.tomorrow.length < 1 && $scope.milongas.day_after.length < 1){
          // console.log('inside if check');
          return false;
      }
      return true;
  }

  $scope.openFaceProfile = function(added_by_id) {
     $window.open('https://www.facebook.com/' + added_by_id, '_blank');
  };

  $scope.sendMail = function(emailId,subject,message){
    console.log('inside sendMail function,', emailId, subject, message);
    $window.open("mailto:"+ emailId + "?subject=" + subject+"&body="+message,"_self");
  };

  $scope.passRange = function(){
    // IF THE USER ENTERS A CITY, PASS ITS COORDS TO BACKEND INSIDE INFO, ELSE PASS THE USERS LOCATION
    if($scope.search && $scope.search.city != 'My Current Location'){
      // console.log("CITY",$scope.search.city);
      pos = {
            lat: $scope.search.city.geometry.location.lat(),
            lng: $scope.search.city.geometry.location.lng()
          };
          st = $scope.search.city.address_components[2].short_name;
      // console.log('lat', $scope.search.city.geometry.location.lat(), 'LNG', $scope.search.city.geometry.location.lng() )
    }
    else{
      pos = user_position;
      st = user_state;
    }
    // IF THE USER ENTERS A RANGE, PASS IT TO BACKEND INSIDE INFO
    if($scope.search && $scope.search.range){
      range = $scope.search.range;
    }

    info = {
      range: range,
      pos: pos,
      state: {state: st}
    };

    // IF THE USER ENTERS A DATE, PASS IT TO BACKEND INSIDE INFO

    if($scope.search && $scope.search.date){
      // console.log("DATE",$scope.search.date)
      info.state.date = $scope.search.date;
    }
    // console.log(range);

    eventsFactory.getMilongas(info, function(data){
          getMapData(data);      
    })
  }


  // IF THE USER ALOWS LOCATION, STORE IT IN POS AND MAKE THE API CALL TO GET THEIR STATE
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {

          user_position = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="
        + user_position.lat + ","
        + user_position.lng 
        + "&key=AIzaSyCVt2_VyislvhmEKm-DzrFwfarQaLrTs4Q")
      .then(function(resp){
        // console.log('RESPO',resp)

        for (var p=0; p < resp.data.results[0].address_components.length; p++){

          if (resp.data.results[0].address_components[p].types[0] == 'administrative_area_level_1') {
              user_state = resp.data.results[0].address_components[p].short_name;
          }
        }
        
        info = {
          range: range,
          pos: user_position,
          state: {state: user_state}
        };
          // state: "IL"};
        // PASS THE STATE TO QUERY ALL MILONGAS IN THAT STATE
        eventsFactory.getMilongas(info, function(data){
          getMapData(data);
        })
      })
          
      })
    }; // END OF IF

    function getMapData(data) {
      // console.log('this is data in indexController get milongas', data);
          $scope.milongas = data;
          // FOR EACH OF THE MILONGAS WE GET BACK, GET THE COORDS FROM GOOGLE MAPS API:
          for(var i in $scope.milongas) {
            for(var j in $scope.milongas[i]){
                (function(i) {
                  (function (j) {
                  // console.log("HERE",$scope.milongas[i][j])
                  var address = 
                          $scope.milongas[i][j].address.st_number 
                        + $scope.milongas[i][j].address.st_name
                        + $scope.milongas[i][j].address.city
                        + $scope.milongas[i][j].address.state;
                // console.log('ADDRESS', address)
                    $http.get("https://maps.googleapis.com/maps/api/geocode/json?address="
                    + address
                    + "&key=AIzaSyCVt2_VyislvhmEKm-DzrFwfarQaLrTs4Q")
                    // SET THE MAP INFO OF THAT PARTICULAR milonga:
                      .then(function(response){ 
                    // console.log('RESPONSE', $scope.milongas[i][j]);
                    $scope.milongas[i][j].map = { 
                            center: { 
                              latitude: response.data.results[0].geometry.location.lat, 
                              longitude: response.data.results[0].geometry.location.lng }, 
                            zoom: 12,
                            control: {},
                            refresh: function () {
                                // console.log('REFRESHING MAP');
                                setTimeout(function (){
                                  $scope.milongas[i][j].map.control.refresh($scope.milongas[i][j].map.center);
                          }, 400)
                              
                          },
                        }
                        $scope.milongas[i][j].link = "http://maps.google.com/?q=" + address
                  });
                })(j);
                })(i);
            }
          } // END OF FOR
    }; //END OF GET MAP DATA FUNCTION

})
