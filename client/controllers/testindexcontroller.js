myApp.controller('indexController', function($scope, eventsFactory, $location, $http, $rootScope, $window){

  // console.log('USER is: ',$rootScope.user);

  var info;
  var state;
  var range = 50;
  var pos = {
    lat: 37.7749295,
    lng: -122.41941550000001,
  }
  var st = 'CA'

  $scope.milongas = {
    today: [],
    tomorrow: [],
    day_after: [],
  };


  $scope.search = {};
  $scope.search.city = 'San Francisco, CA, USA';

  info = {
      range: range,
      pos: pos,
      state: {state: st}
  };

  eventsFactory.getMilongas(info, function(data){
    getMapData(data);      
  })



  $scope.$watch("search.range", function(newValue, oldValue) {
    range = newValue
    info.range = range;
    eventsFactory.getMilongas(info, function(data){
          getMapData(data);      
    })
  });

  $scope.$watch("search.city", function(newValue, oldValue) {
    pos = {
      lat: $scope.search.city.geometry.location.lat(),
      lng: $scope.search.city.geometry.location.lng()
    };
    st = $scope.search.city.address_components[2].short_name;
    info.pos = pos;
    info.state = {state: st}
    eventsFactory.getMilongas(info, function(data){
          getMapData(data);      
    })
  });

  $scope.$watch("search.date", function(newValue, oldValue) {
    info.state.date = newValue;
    eventsFactory.getMilongas(info, function(data){
          getMapData(data);      
    })
  });

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

  $scope.map = [];

  $scope.autocompleteOptions = {
    types: ['(cities)'],
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

  $scope.sendMail = function(emailId,subject,message){
    console.log('inside sendMail function,', emailId, subject, message);
    $window.open("mailto:"+ emailId + "?subject=" + subject+"&body="+message,"_self");
  };

})
