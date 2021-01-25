var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var routes = require('./routes/routes');
var mongoose = require('mongoose');
var cors = require('cors');

var app = express();
// Mongodb connection 
mongoose.set('debug', true)
mongoose.connect(process.env.DB_HOST, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected");
  }
});


app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
var routerV1 = express.Router();
routes.setRoutes(routerV1);
app.use(routerV1);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, "API not found"));
});

// error handler
app.use(function (err, req, res, next) {
  try {
    res.status(err.status).json({ msg: "Something went wrong", err: err.message })
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", err: err })
  }
});

module.exports = app;
