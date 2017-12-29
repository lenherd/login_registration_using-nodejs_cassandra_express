var express = require('express');
var router = express.Router();

//Cassandra connection
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'loginapp' });

/*  register page. */
router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Express' });
});

/* ask user to  register page. */
router.post('/register', function (req, res, next) {
  var name = req.body.name;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;

  //console.log(name,email);

  //Compulsory field validation
  req.checkBody('name', 'Name is compulsory').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  if (errors) {
    //console.log("yes");
    res.render('register', {
      errors: errors
      //this error is caught in register.handlebars
    });
  }
  else {
    // console.log("WORKS");
    //Register a new user    
    var sql = "INSERT INTO user (name,email,password,username) VALUES (?, ?, ?, ?)";
    var parameters = [name, email, password, username];   //using prepared statment like jdbc
    client.execute(sql, parameters, { prepare: true });

    //uses connectflash module
    req.flash('success_msg', 'You are Registered!!! You can Login');
    res.redirect('login');
  }
});

//Getting valid user to login
router.post('/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  //compulsory fields
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    //console.log("yes");
    res.render('login', {
      errors: errors
      //this error is caught in register.handlebars
    });
  }
  else {
    // console.log("WORKS");
    //Check username and password   
    var sql = "SELECT username,password FROM user WHERE username = ? AND password = ? ALLOW FILTERING";
    var parameters = [username, password];   //using prepared statment like jdbc

    client.execute(sql, parameters, { prepare: true }, function (err, result) {
      if (!err) {
        if (result.rows.length > 0) {
          var user = result.rows[0];
          console.log("username = %s, password =%s", user.username, user.password);
          req.flash('success_msg', 'Login successful');
          res.redirect('/');
        } else {
          console.log("no op");
          req.flash('error_msg', 'Sorry , username and/or passwords dont match');
          res.redirect('login');
        }
      }

    });
  }


});

/* GET logout page. */
router.get('/logout', function (req, res) {
  res.redirect('login');
});

module.exports = router;
