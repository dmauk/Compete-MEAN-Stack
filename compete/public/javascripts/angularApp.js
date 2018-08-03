var app = angular.module('compete', ['ui.router']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

	$stateProvider
	  .state('home', {
		url: '/home',
		templateUrl: '/templates/home.ejs',
		controller: 'MainCtrl',
		resolve: {
		  postPromise: ['posts', function(posts){
		    return posts.getAll();
		  }]
		}
	  })
	  .state('posts', {
		url: '/posts/{id}',
		templateUrl: '/templates/posts.ejs',
		controller: 'PostsCtrl',
		resolve: {
                  post: ['$stateParams', 'posts', function($stateParams, posts) {
			return posts.get($stateParams.id);
		  }]
		},
		onEnter: ['$state', '$stateParams', function($state, $stateParams) {
                  if($stateParams.id === '' || !$stateParams.id) {
                    $state.go('home');
		  }
		}]
	  })
	  .state('login', {
                url: '/login',
		templateUrl: '/templates/login.ejs',
		controller: 'AuthCtrl',
		onEnter: ['$state', 'auth', function($state, auth){
		  if(auth.isLoggedIn()){
			$state.go('home');
		  }
		}]
	  })
	  .state('register', {
		url: '/register',
		templateUrl: '/templates/register.ejs',
		controller: 'AuthCtrl',
		onEnter: ['$state', 'auth', function($state, auth){
                  if(auth.isLoggedIn()){
                    $state.go('home');
		  }
		}]
          })
          .state('profile', {
	        url: '/profile/{username}',
	        templateUrl: '/templates/profile.ejs',
	        controller: 'ProfileCtrl',
	        resolve: {
                  user: ['$stateParams', 'users', function($stateParams,users){
                    return users.get($stateParams.username);
		  }]
		},
	        onEnter: ['$state', '$stateParams', function($state, $stateParams){
                  if(!$stateParams.username || $stateParams.username === '') {
		    $state.go('home');
		  }
		}]
	  });


	$urlRouterProvider.otherwise('home');
}]);

function is_url(str){
  regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(str)) { return true;}
  return false;
}

app.controller('MainCtrl', [
'$scope',
'auth',
'posts',
function($scope, auth, posts){
  $scope.posts = posts.posts;
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.currentUser = auth.currentUser;
  $scope.addPost = function(){
    if(!$scope.title || $scope.title === '') {return;}
    if($scope.link !== undefined){
      if(!is_url($scope.link)) {
        $scope.error="Invalid URL";
        return;
      }
    }
    posts.create({
	  title: $scope.title,
	  link: $scope.link,
          description: $scope.description
	});
	$scope.title = '';
        $scope.error = '';
	$scope.link = '';
        $scope.description = '';
  };

  $scope.deletePost = function(post){
    posts.delete(post);
  };

  $scope.incrementUpvotes = function(post) {
	posts.upvote(post);
  };
}]);


