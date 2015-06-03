'use strict';

angular.module('mrWebdesignApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller/', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      changeRole: {
        method: 'PUT',
        params: {
          controller:'role',
          targetId:'targetUserId'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
