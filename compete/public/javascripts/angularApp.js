var app = angular.module('compete', ['ui.router']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
	
	$stateProvider
	  .state('home', {
		url: '/home',
		templateUrl: '/home.html',
		controller: 'MainCtrl'
	  })
	  .state('posts', {
		url: '/posts/{id}',
		templateUrl: '/posts.html',
		controller: 'PostsCtrl'
	  });

	$urlRouterProvider.otherwise('home');
}]);

app.factory('posts', [function(){
  var o = {
	posts: [{title: "Basic", link: "http://www.google.com/", upvotes: 5}]
  };
  return o;
}]);

app.controller('MainCtrl', [
'$scope',
'posts',
function($scope, posts){
  $scope.test = 'Hello world!';
  $scope.posts = posts.posts;

  $scope.addPost = function(){
	if(!$scope.title || $scope.title === '') {return}
    $scope.posts.push({
	  title: $scope.title,
	  link: $scope.link,
	  upvotes: 0,
	  comments: [
	    {author: 'Joe', body: 'Nice!', upvotes: 3},
		{author: 'Rich', body: 'Wow!', upvotes: 4}
	  ]
	});
	$scope.title = '';
	$scope.link = '';
  };

  $scope.incrementUpvotes = function(post) {
	post.upvotes +=1;
  };
}]);

app.controller('PostsCtrl', [
  '$scope',
  '$stateParams',
  'posts',
  function($scope, $stateParams, posts){
	$scope.post = posts.posts[$stateParams.id];

	$scope.addComment = function(){
	if(!$scope.body || $scope.body === '') {return;}
    $scope.post.comments.push({
	  body: $scope.body,
	  author: 'user',
	  upvotes: 0
	});
	$scope.body = '';
  };

}]);
