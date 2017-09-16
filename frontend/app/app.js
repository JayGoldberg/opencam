var app = angular.module('myApp', ['ui.bootstrap']);

app.controller('CamGetter', function($scope, $http, $log) {
  
  $http.get('config.json')
    .success(function(data, status) {
      $scope.endpoint = data.endpoint
  });
  
  $scope.clear = function () {
    $scope.dropdowns = {};
  };

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  
  $scope.toggleDay = function() {
    $scope.daylight = ! $scope.daylight;
  };

  $scope.loadmenus = function () {
    $scope.dropdowns = {};

    $http.post($scope.endpoint + '/list/cities')
      .success(function (result) {
        $scope.dropdowns.cities = result.sort();
      })
      .error(function (error) {
        $scope.dropdowns.error = error;
      });

    $http.post($scope.endpoint + '/list/regions')
      .success(function (result) {
        $scope.dropdowns.regions = result.sort();
      })
      .error(function (error) {
        $scope.dropdowns.error = error;
      });

    $http.post($scope.endpoint + '/list/countries')
      .success(function (result) {
        $scope.dropdowns.countries = result.sort();
      })
      .error(function (error) {
        $scope.dropdowns.error = error;
      });

    $http.post($scope.endpoint + '/list/tags')
      .success(function (result) {
        $scope.dropdowns.tags = result.sort();
      })
      .error(function (error) {
        $scope.dropdowns.error = error;
      });
  };

  $scope.dropdownChange = function () {
    
    var dataObj = {
      "country" : $scope.dropdowns.country,
      "city" : $scope.dropdowns.city,
      "region": $scope.dropdowns.region,
      "tags": $scope.dropdowns.tag
    };

    $http.post($scope.endpoint + '/cameras', dataObj)
      .success(function(data, status) {
        $scope.matches = data;
        })
      .error(function(data, status) {
        alert( "failure message: " + JSON.stringify({data: data}));
      });
    //$scope.loadmenus()
  };
  
  $scope.clear = function() {
    $scope.starttime = null;
    $scope.endtime = null;
  };
});
