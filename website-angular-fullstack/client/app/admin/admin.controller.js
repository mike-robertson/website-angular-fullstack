'use strict';

angular.module('mrWebdesignApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, socket) {

    console.log('beginning isAdmin: ' + Auth.isAdmin());
    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.userRoles = [
      'admin', 'user'
    ];

    $http.get('/api/users').success(function(users) {
      $scope.users = users;
      socket.syncUpdates('user', $scope.users);
    });
    // TODO: We want to add a way to change a user's role from base user to admin.

    $scope.delete = function(user) {
      if(Auth.isAdmin()) {
        User.remove({ id: user._id });
        angular.forEach($scope.users, function(u, i) {
          if (u === user) {
            $scope.users.splice(i, 1);
          }
        });
      }
      else
      {
        $scope.users = User.query();
      }
    };

    $scope.changeRole = function(newRole, targetUser) {
      $scope.submitted = true;
      if(newRole !== '') {
        Auth.changeRole( newRole, targetUser )
        .then( function() {
          console.log('user updated');
          console.log('isAdmin: ' + Auth.isAdmin());
          if(!Auth.isAdmin()) {
            console.log('it should update');
            $scope.users = User.query();

          }

        })
        .catch( function() {
          $scope.users = User.query();
        });
      }
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('comment');
    });
  });
