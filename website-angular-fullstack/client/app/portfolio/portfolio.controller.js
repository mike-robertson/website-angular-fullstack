'use strict';

angular.module('mrWebdesignApp')
  .controller('PortfolioCtrl', function ($scope, $http, Auth) {

    // Bind the Auth functions to scope so it is easy to access in our html.
    $scope.isAdmin = Auth.isAdmin;
    $scope.isLoggedIn = Auth.isLoggedIn;

  });
