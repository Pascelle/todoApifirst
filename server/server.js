//this is the root of our app.  when we want to start the app we run this file.  

// Inside the API there are basic CRUD operations.  When you want to create a resource you use the POST http method.  And you send that resource as the body.  This means that when you want to make a new todo we’re going to send a JSON object over to the server, it’s going to have a text property and the server is going to get that text property, create the new model and send the complete model with the ID, the completed property and completedat back to the client.  

//the server.js file is just responsnible for our routes.

//we access the mongoose property via ES6 destructuring.  We create a local var called mongoose equal to the mongoose property on the obj, and that obj is going to be the return result from requiring the file we created (mongoose.js)
var express = require('express');
var bodyParser = require('body-parser');
//var called bodyParser, setting it equal to the return result of requiring body-parser
//The body parser module lets us send JSON to the server.  The server can then take that JSON and do something with it. Body parser essentially parses the body.  It takes the string body and turns it into a JS object.

// KEEP LOCAL AND LIBRARY IMPORTS SEPARATE

//by using this we can access anything in mongoose
var {mongoose} = require('./db/mongoose');
//load in todo and user
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const {ObjectID} = require('mongodb');

var app = express();
//this stores our express application, equal to a call to express

const port = process.env.PORT || 3000;
//this is the var that may or may not be set.  It will be set if the app is running on heroku.  3000 is the local port if the port isn't otherwise defined.  

//below establishes the post route which lets us create basic to dos. When you want to create a resource you use the post http method and you send that resource as the body.  This means that when we want to make a new todo we send a JSON object over to the server it is going to have a text property, the server is goign to get that text property, create the new model and send the complete model with the ID, the completed property and completedat back to the client.  
//below we are getting the body data that got sent from the client using the bodyParser module
app.use(bodyParser.json());
	//the point of this is to be able to send JSON to our express application. the json method returns a function and that function allows the app to talk to express.  it is the middle man between the app and express...it allows us to send JSON to the express application
	//app.use helps us set up middleware. if we write custom middleware app.use will take a fcn if it is third party it will take something off of the library.  here bodyParser.json is getting called as a fcn.  the return value from this json method is a fcn and that is the middleware that we need to give to express.  then we can send JSON to our express application (below in app.post)

//To set up a route we need to call app.post, it takes a url and a callback fcn as arguments
app.post('/todos', (req, res) => {
	//the req param is what we are sending to the server.  it is a string from the client, sent to body parser which converts it into JSON.  Below we are getting that JSON from the bodyparser and creating a new todo document and below that saving it to the database.

	//creates a new todo
	var todo = new Todo({
		text: req.body.text
		//This is from the app.use above; the body is stored by bodyParser
	});
	//adds it to the database
	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});

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

//how to fetch a variable that is passed in via the url, for example getting docs //GET /todos/12323131.  To accomplish this we use a url parameter.  Here it is :id.  The url parameter creates an id variable that is on the request object and we'll be able to access that variable.  Below, when the url is requested, the callback is fired and we'll be able to query by the id they pass in
app.get('/todos/:id', (req, res) => {
	//user enters url, last part, the id gets filled into the request object.  we can access it using req.params.id
	var id = req.params.id;
	//validate the id
	if (!ObjectID.isValid(id)) {
	return console.log(res.status(404).send());
		//if not valid, stop fcn execution and respond with 404 and send back the empty body - just call send without passing in any value.
		//took off .send() at the end bc it was too long in the terminal, but it caused an error
	}

	//query the db todos collection for a matching doc
	Todo.findById(id).then((todo) => {
	if (!todo) {
		//this is if the id is not found in the db
		return res.status(404).send();
		//took off  at the end bc it was too long in the terminal
	}
	 res.send({todo});
}).catch((e) => console.log(res.status(400).send('Bad Request')));
	//this is some other error	
});
	//res.send(req.params); 
	//req.params is an obj that has key-value pairs where the key is the url param (like id) and the value is what actual  value is put there.  Here we are asking the response.send method to send back the request.params object.  This is going to let us test out the route inside of postman and see exactly how it works
app.listen(port, () => {
	console.log(`Started up at port ${port}`);
});

//above creates a very basic server

module.exports = {app};
//setting it equal to an obj and on that obj we set the app property equal to the app variable