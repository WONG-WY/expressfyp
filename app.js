var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var cors = require("cors");
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const session = require('express-session');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
// {
//   origin: 'http://localhost:5173',
//   credentials: true // for send cookies or other credentials
// }));
var app = express();
const jwtCheck = require('./auth');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


passport.use(new Auth0Strategy({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENTID,
  clientSecret: process.env.AUTH0_CLIENTSECRET,
  callbackURL: 'http://localhost:3000/api/auth/callback'
}, (accessToken, refreshToken, extraParams, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Express session setup
app.use(session({
  secret: process.env.GENERALUSER_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

app.use('/api', jwtCheck); //must under passport & session
app.use("/api", indexRouter); //protected by jwt
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
