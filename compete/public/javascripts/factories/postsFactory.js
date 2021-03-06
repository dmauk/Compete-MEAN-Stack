app.factory('posts', ['$http','auth', function($http, auth){
  var o = {
	posts: []
  };

  o.getAll = function() {
    return $http.get('/posts').success(function(data){
		angular.copy(data, o.posts);
	});
  };

  o.getUserPosts = function(username) {
    return $http.get('/posts/user/' + username).then(function(res){
      return res.data;
    });
  }

  o.create = function(post) {
    return $http.post('/posts', post, {
	  headers: {Authorization: 'Bearer '+auth.getToken()}
	}).success(function(data){
	  o.posts.push(data);
	});
  };

  o.delete = function(postToRemove) {
    if(auth.currentUser() != postToRemove.author){
      console.log('Cannot delete because you are not the author!');
      return;
    }


    return $http.post('/posts/' + postToRemove._id + '/delete', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      var index = o.posts.indexOf(postToRemove);
      if(index!==-1) { o.posts.splice(index,1);}
    });
  };

  o.get = function(id) {
    return $http.get('/posts/' + id).then(function(res){
      return res.data;
	});
  };

  o.upvote = function(post) {
	return $http.put('/posts/' + post._id + '/upvote', null, {
	  headers: {Authorization: 'Bearer '+auth.getToken()}
	}).success(function(data){
	    post.upvotes += 1;
	  });
  }

  o.addComment = function(id, comment) {
    return $http.post('/posts/' + id + '/comments', comment, {
      headers: {Authorization: 'Bearer ' +auth.getToken()}
    });
  };

  o.upvoteComment = function(post, comment) {
    return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
	  headers: {Authorization: 'Bearer ' +auth.getToken()}
	}).success(function(data){
	    comment.upvotes += 1;
      });
  }


  return o;
}])

