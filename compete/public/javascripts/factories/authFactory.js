app.factory('auth', ['$http', '$window', function($http, $window){
  var o = []

  o.saveToken = function(token) {
    $window.localStorage['super-cool-compete-app-token'] = token;
  };

  o.getToken = function() {
    return $window.localStorage['super-cool-compete-app-token'];
  };

  o.isLoggedIn = function(){
    var token = o.getToken();

    if(token){
      var payload = JSON.parse($window.atob(token.split('.')[1]));

	  return payload.exp > Date.now() / 1000;
	} else {
      return false;
	}
  };

  o.currentUser = function() {
    if(o.isLoggedIn()){
      var token = o.getToken();
	  var payload = JSON.parse($window.atob(token.split('.')[1]));

	  return payload.username;
	}
  };

  o.register = function(user) {
    return $http.post('/register', user).success(function(data){
	  o.saveToken(data.token);
	});
  };

  o.logIn = function(user) {
    return $http.post('/login', user).success(function(data){
      o.saveToken(data.token);
	});
  };

  o.logOut = function() {
    $window.localStorage.removeItem('super-cool-compete-app-token');
  };

  return o;
}]);


