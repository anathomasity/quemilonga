myApp.controller('generalMapController', function($scope, $routeParams, eventsFactory, $location, $http, $rootScope, $facebook, $window){

    var dat = [];
    $window.scrollTo(0, 0);
    $scope.toggleClass("calendarRow", "findRow", "forumRow");


    eventsFactory.countMilongas(function(data){
        dat.push(['Country', 'Popularity '])

        for(var i = 0; i < data.data.length; i++) {
            dat.push([data.data[i]._id, data.data[i].count])
        } 
        
        google.charts.load('upcoming', {'packages':['geochart']});
        google.charts.setOnLoadCallback(drawRegionsMap);

        function drawRegionsMap() {

            var data = google.visualization.arrayToDataTable(dat);

            var options = {};

            var chart = new google.visualization.GeoChart(document.getElementById('map'));

            chart.draw(data, options);
        }

        FB.XFBML.parse();

    })

});