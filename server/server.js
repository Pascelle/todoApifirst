//this is the root of our app.  when we want to start the app we run this file.  

// Inside the API there are basic CRUD operations.  When you want to create a resource you use the POST http method.  And you send that resource as the body.  This means that when you want to make a new todo we’re going to send a JSON object over to the server, it’s going to have a text property and the server is going to get that text property, create the new model and send the complete model with the ID, the completed property and completedat back to the client.  

//the server.js file is just responsnible for our routes.

//we access the mongoose property via ES6 destructuring.  We create a local var called mongoose equal to the mongoose property on the obj, and that obj is going to be the return result from requiring the file we created (mongoose.js)
var express = require('express');
var bodyParser = require('body-parser');
//var called bodyParser, setting it equal to the return result of requiring body-parser
//The body parser module lets us send JSON to the server.  The server can then take that JSON and do something with it. Body parser essentially parses the body.  It takes the string body and turns it into a JS object.

// KEEP LOCAL AND LIBRARY IMPORTS SEPARATE

var {mongoose} = require('./db/mongoose');
//load in todo and user
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
//this stores our express application, equal to a call to express

//below establishes the post route which lets us create basic to dos. When you want to create a resource you use the post http method and you send that resource as the body.  This means that when we want to make a new todo we send a JSON object over to the server it is going to have a text property, the server is goign to get that text property, create the new model and send the complete model with the ID, the completed property and completedat back to the client.  
//below we are getting the body data that got sent from the client using the bodyParser module
app.use(bodyParser.json());
	//the point of this is to be able to send JSON to our express application. the json method returns a function and that function allows the app to talk to express.  it is the middle man between the app and express...it allows us to send JSON to the express application
	//app.use helps us set up middleware. if we write custom middleware app.use will take a fcn if it is third party it will take something off of the library.  here bodyParser.json is getting called as a fcn.  the return value from this json method is a fcn and that is the middleware that we need to give to express.  then we can send JSON to our express application (below in app.post)

//To set up a route we need to call app.post, it takes a url and a callback fcn as arguments
app.post('/todos', (req, res) => {
	//the req param is what we are sending to the server.  it is a string from the client, sent to body parser which converts it into JSON.  Below we are getting that JSON from the bodyparser and creating a new todo document and below that saving it to the database.

	// //creates a new todo
	// var todo = new Todo({
	// 	text: req.body.text
	// 	//This is from the app.use above; the body is stored by bodyParser
	// });
	// //adds it to the database
	// todo.save().then((doc) => {
	// 	res.send(doc);
	// }, (e) => {
	// 	res.status(400).send(e);
	// });

	var secondtodo = new Todo({
		text: req.body.text //what we entered into postman
		});
	
	secondtodo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
	
	
});

//the get route is the route you use to get all of your todos
app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});
		//when you have an array, you don't want to just pass in the array itself because you may want to add on later and that is hard when you just pass in the array.  Instead create an object and on that obj specify todos, setting it equal to the todos array using ES6
	}, (e) => {
		res.status(400).send(e);
	});
});

app.listen(3000, () => {
	console.log('Started on port 3000');
});

//above creates a very basic server

module.exports = {app};
//setting it equal to an obj and on that obj we set the app property equal to the app variable