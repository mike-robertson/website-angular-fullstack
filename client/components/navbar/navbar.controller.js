'use strict';

angular.module('mrWebdesignApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
        'title': 'Home',
        'link': '/',
        'subMenu': []
      }, {
        'title': 'Resume',
        'link': '/resume',
        'subMenu': []
      }, {
        'title': 'Portfolio',
        'link': '/portfolio',
        'subMenu': [{
            'title': 'Github Page',
            'link': 'https://github.com/mike-robertson',
            'htmlTarget': '_blank'
          }, {
            'title': 'Falling Sand Game',
            'link': '/fsg',
            'htmlTarget': ''
          }]
      }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });