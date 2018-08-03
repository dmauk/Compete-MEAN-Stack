app.controller('ProfileCtrl', [
  '$scope',
  'auth',
  'users',
  'posts',
  'user',
  function($scope, auth, users, posts, user){
    $scope.username = user.username;
    $scope.currentUser = auth.currentUser;
    $scope.posts = user.posts;

  }
]);
