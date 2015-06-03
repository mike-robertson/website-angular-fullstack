'use strict';

angular.module('mrWebdesignApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('resume', {
        url: '/resume',
        templateUrl: 'app/resume/resume.html',
        controller: 'ResumeCtrl'
      });
  });