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
      $scope.milongas = data;  
  })



  $scope.$watch("search.range", function(newValue, oldValue) {
    range = newValue
    info.range = range;
    eventsFactory.getMilongas(info, function(data){
        $scope.milongas = data;   
    })
  });

  $scope.$watch("search.city", function(newValue, oldValue) {
    if(newValue != oldValue){
      pos = {
        lat: $scope.search.city.geometry.location.lat(),
        lng: $scope.search.city.geometry.location.lng()
      };
      st = $scope.search.city.address_components[2].short_name;
      info.pos = pos;
      info.state = {state: st}
      eventsFactory.getMilongas(info, function(data){
          $scope.milongas = data;   
      })
    }
    
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
      console.log(response);
      document.getElementById('map_canvas_' + mId).style.display="block";
      initializeMap(response, mId);
    });
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

  $scope.sendMail = function(emailId,subject,message){
    $window.open("mailto:"+ emailId + "?subject=" + subject+"&body="+message,"_self");
  };

})