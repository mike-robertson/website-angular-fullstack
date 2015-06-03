'use strict';

angular.module('mrWebdesignApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth) {
    $scope.comments = [];
    $scope.newComment = {
      text: '',
      name: ''
    };

    // Bind the Auth functions to scope so it is easy to access in our html.
    $scope.isAdmin = Auth.isAdmin;
    $scope.isLoggedIn = Auth.isLoggedIn;

    $http.get('/api/comments').success(function(comments) {
      $scope.comments = comments;
      socket.syncUpdates('comment', $scope.comments);
    });

    $scope.addComment = function() {
      if($scope.newComment.text === '') {
        return;
      }
      // If the user is logged in, use his name. If not logged in, and no name enetered, give it an anonymous name.
      if($scope.isLoggedIn()) {
        $scope.newComment.name = Auth.getCurrentUser().name;
      }
      else if($scope.newComment.name === '') {
        $scope.newComment.name = 'Anonymous User';
      }

      $http.post('/api/comments', $scope.newComment);
      $scope.newComment = {
        text: '',
        name: ''
      };
    };

    // This could be added back in once I figure out how to restrict this to admin.
    $scope.deleteComment = function(comment) {
      $http.delete('/api/comments/' + comment._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('comment');
    });
  });
