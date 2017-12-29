var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

//additional imports
var expressHandlebars = require('express-handlebars');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var flash = require('connect-flash');

//Cassandra connection
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'loginapp'});

// view engine setup for express handlers
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expressHandlebars({defaultLayout : 'layout'}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

/*****************************Express session*********************************/
app.use(expressSession({
  secret : 'secret',
  saveUninitialized : true,
  resave : true
}));
/*****************************Express session*********************************/

/*****************************Express validator*********************************/
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param : formParam,
      msg : msg,
      value : value
    }
  }
}));
/*****************************Express validator*********************************/

//Connect Flash
app.use(flash());
//Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', index);
app.use('/users', users);

//setting port
var port = process.env.PORT || '3000';
app.set('port', port);

app.listen(app.get('port'),function(){
  console.log("Server has started on " + app.get('port'));
})

module.exports = app;
