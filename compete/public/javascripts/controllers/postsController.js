app.controller('PostsCtrl', [
  '$scope',
  'auth',
  'posts',
  'post',
  function($scope, auth, posts, post){
	$scope.post = post;
    $scope.isLoggedIn = auth.isLoggedIn;

	$scope.addComment = function(){
	  if(!$scope.body || $scope.body === '') {return;}
      posts.addComment(post._id, {
	    body: $scope.body,
	    author: 'user', // Change to use logged in user
	  }).success(function(comment){
	    $scope.post.comments.push(comment);
	  });

	  $scope.body = '';
	};

    $scope.incrementUpvotes = function(comment){
	  posts.upvoteComment(post, comment);
	};
}]);
