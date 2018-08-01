app.factory('users', ['$http','auth', function($http, auth){
  var o = {
    users: []
  };

  /*o.getAll = function() {
    return $http.get('/users').success(function(data){
      angular.copy(data, o.users);
    });
  };*/

  o.get = function(username) {
    return $http.get('/users/' + username).then(function(res){
      return res.data;
    });
  }

  return o;

}]);

