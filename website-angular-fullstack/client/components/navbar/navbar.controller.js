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
            'title': 'myCongressperson app',
            'link': 'http://mycongressperson.org/',
            'htmlTarget': '_blank'
          }, {
            'title': 'Falling Sand Game',
            'link': '/fsg',
            'htmlTarget': ''
          }, {
            'title': 'Simple Classified Example',
            'link': 'http://douglass-test.herokuapp.com/',
            'htmlTarget': '_blank'
          }, {
            'title': 'Simple Store',
            'link': 'http://portland-store-app.herokuapp.com/',
            'htmlTarget': '_blank'
          }, {
            'title': 'Simple Google Maps Example',
            'link': 'http://mike-doctor-finder.herokuapp.com/',
            'htmlTarget': '_blank'
          }, {
            'title': 'Restaurant Facade',
            'link': 'http://hotdogstore.herokuapp.com/',
            'htmlTarget': '_blank'
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