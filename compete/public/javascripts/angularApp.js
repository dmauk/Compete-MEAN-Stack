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


app.controller('MainCtrl', [
'$scope',
'auth',
'posts',
function($scope, auth, posts){
  $scope.posts = posts.posts;
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.currentUser = auth.currentUser;
  $scope.addPost = function(){
    if(!$scope.title || $scope.title === '') {return}
    posts.create({
	  title: $scope.title,
	  link: $scope.link,
          description: $scope.description
	});
	$scope.title = '';
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


