'use strict';

angular.module('mrWebdesignApp')
  .controller('ResumeCtrl', function ($scope, $http, Auth) {

    // Bind the Auth functions to scope so it is easy to access in our html.
    $scope.isAdmin = Auth.isAdmin;
    $scope.isLoggedIn = Auth.isLoggedIn;

    $scope.jobExperiences = [{
    	'company': 'Sogeti',
    	'location': 'Cincinnati, OH',
    	'startDate': 'June 2013',
    	'endDate': 'present',
    	'role': 'Software Consultant',
    	'descriptions': [
    		'Worked with javascript/jQuery to add functionality to frontends of web applications.',
    		'Between contracts, work with new frameworks such as AngularJS, Node and useful libraries.',
    		'Work on large scale migration which required heavy use of Java/JDBC and Oracle SQL queries and procedures',
    		'Worked on projects maintaining and modifying enterprise Java web applications.',
    		'Agile project style application development'
    	]
    }, {
    	'company': 'Case Western Reserve University',
    	'location': 'Cleveland, OH',
    	'startDate': 'March 2012',
    	'endDate': 'May 2013',
    	'role': 'Programmer/Analyst',
    	'descriptions': [
    		'Add functionality to new and existing applications/webpages with Javascript/jQuery',
    		'Creating new HTML/CSS front end webpages',
    		'Create and maintain functions, triggers, and tables in Oracle database',
    		'Create applications (Oracle APEX)/webpages to access databases and display',
    		'Work with non-technical researchers to create the database and application functionality required'
    	]
    }, {
    	'company': 'Sidways, Inc.',
    	'location': 'Cleveland, OH',
    	'startDate': 'March 2011',
    	'endDate': 'June 2011',
    	'role': 'Developer Intern',
    	'descriptions': [
    		'Agile project style application development',
    		'Worked on basic iOS mobile applications',
    		'Learned basics of Objective C'
    	]
    }, {
    	'company': 'Personal Projects',
    	'location': '',
    	'startDate': '',
    	'endDate': '',
    	'role': '',
    	'descriptions': [
    		'This website (developed using Yeoman/Grunt, uses a Node.js/Express backend, AngularJS frontend, and uses MongoDB as the DB',
    		'Created Falling Sand style game completely in javascript',
    		'Work on various hackerrank.com challenges',
    		'<a href="https://github.com/mike-robertson">My Github Link</a>'
    	]
    }];

  });
