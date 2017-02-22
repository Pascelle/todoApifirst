//first, load in mongoose
var mongoose = require('mongoose');

//mongoose supports promises.  here we're telling mongoose we want to use the built in JS promise library
mongoose.Promise = global.Promise;

//then connect to the db.  we can't start writing data to the db until mongoose knows how to connect
mongoose.connect('mongodb://localhost:27017/TodoApp');
//mongoose maintains its connection over time.  this means that mongoose is always waiting for a piece of code that connects to the database.  this is one of the advatanges of mongoose-- you don't have to mincromanage the order in which things appear to make sure that they are read in time

module.exports = {mongoose}; //this is the equivalent of mongoose: mongoose (property: value)