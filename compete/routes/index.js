var express = require('express');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'}); // Add Environment variable later.
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

/* GET posts */
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err) { return next(err); }
	res.json(posts);
  });
});

/*GET a user's posts */
router.get('/posts/user/:user', function(req, res) {
  req.user.populate('posts', function(err, user) {
    if(err) { return next(err); }
      res.json(user.posts);
  });
});

router.get('/users/:user', function(req, res) {
  req.user.populate('posts', function(err, user) {
    if(err) { return next(err); }
    res.json(user);
  });
});

/* POST a post */
router.post('/posts', auth, function(req, res, next) {
  var post = new Post(req.body);
  post.author = req.payload.username;
  User.findOne({username: req.payload.username}, function(err, user){
    if(err) { return next(err); }
    if(!user) { return next (new Error('can\'t find user')); }
      post.save(function(err, post) {
        if(err){ return next(err); }
	user.posts.push(post);
	user.save();
	res.json(post);
      });
  });
});

router.post('/posts/:post/delete', auth, function(req, res, next){
  Post.remove({_id: req.post._id}, function(err, data){
    if(err) { return next(err); }
      res.json(data);
  });
});

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
	return res.status(400).json({message: 'Please fill out all fields'});
  }

  User.findOne({username: req.body.username}, function(err,user){
    if(user) { return res.status(400).json({message: 'Username already exists!'})};
  });

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password);

  user.save(function (err){
    if(err) { return next(err); }

	return res.json({token: user.generateJWT()});
  });
});

router.post('/editProfile', function(req, res, next){
  if(!req.body.profileImg) {
    return res.status(400).json({message: 'There are no changes to the profile.'});
  }


});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err) { return next(err); }

	if(user){
      return res.json({token: user.generateJWT()});
	} else {
      return res.status(401).json(info);
	}
  })(req, res, next);
});

/* Preload post object if it is a PARAM in a url */
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if(err) { return next(err); }
	if(!post) { return next (new Error('can\'t find post')); }

	req.post = post;
	return next();
  });
});

router.param('comment', function(req, res, next, id){
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if(err) { return next(err); }
	if(!comment) { return next (new Error('can\'t find comment')); }

	req.comment = comment;
	return next();
  });
});

router.param('user', function(req, res, next, username){
  var query = User.findOne({username: username}, {username:1, posts:1});

  query.exec(function (err, user){
    if(err) { return next(err); }
    if(!user) { return next (new Error('can\'t find user')); }

    req.user = user;
    return next();
  });
});

router.put('/posts/:post/upvote', auth, function(req, res, next) {
  req.post.upvote(function(err, post){
	if (err) { return next(err); }

	res.json(post);
  });
});

/* GET single POST */
router.get('/posts/:post', function(req, res) {
  req.post.populate('comments', function(err, post) {
    if(err) { return next(err); }

	res.json(post);
  });
});

/* GET single COMMENT */
router.get('/comments/:comment', function(req, res) {
  res.json(req.comment);
});

/* POST comment */
router.post('/posts/:post/comments', auth, function(req, res, next) {
	var comment = new Comment(req.body);
	comment.post = req.post;
	comment.author = req.payload.username;

	comment.save(function(err, comment){
	  res.json(comment);
	  if(err) { return next(err); }

	  req.post.comments.push(comment);
	  req.post.save(function(err, post) {
            if(err){ return next(err); }
	  })
	});
});

router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if(err) { return next(err); }

	res.json(comment);
  });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
