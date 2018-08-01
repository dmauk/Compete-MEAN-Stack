app.controller('ProfileCtrl', [
  '$scope',
  'users',
  'posts',
  'user',
  function($scope, users, posts, user){
    $scope.username = user.username;
    $scope.posts = user.posts;
  }
]);
