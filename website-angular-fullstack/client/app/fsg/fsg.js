'use strict';

angular.module('mrWebdesignApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('fsg', {
        url: '/fsg',
        templateUrl: 'app/fsg/fsg.html',
        controller: 'FSGCtrl'
      });
  });