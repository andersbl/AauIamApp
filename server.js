var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');


var OICStrategy = require('passport-openid-connect').Strategy
var User = require('passport-openid-connect').User

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

var oic = new OICStrategy({
  "issuerHost": "aauiamapp.dk",
  "client_id": "@!C5A9.5DE6.4387.4EA4!0001!6906.7631!0008!B441.37B3",
  "client_secret": "prSc1tGVRg7B",
  "redirect_uri": "http://127.0.0.1:3000/callbackstefan",
  "scope": "openid user_name email"
});


passport.use(oic)

passport.serializeUser(OICStrategy.serializeUser)
passport.deserializeUser(OICStrategy.deserializeUser)



// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which


// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.get('/loginStefan', passport.authenticate('passport-openid-connect', {"successReturnToOrRedirect": "/"}))
app.get('/callbackStefan', passport.authenticate('passport-openid-connect', {"callback": true, "successReturnToOrRedirect": "/sucess"}))


// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });


app.listen(3000);
