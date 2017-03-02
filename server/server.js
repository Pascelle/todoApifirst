//this is the root of our app.  when we want to start the app we run this file.  

// Inside the API there are basic CRUD operations.  When you want to create a resource you use the POST http method.  And you send that resource as the body.  This means that when you want to make a new todo we’re going to send a JSON object over to the server, it’s going to have a text property and the server is going to get that text property, create the new model and send the complete model with the ID, the completed property and completedat back to the client.  

//the server.js file is just responsnible for our routes.

//we access the mongoose property via ES6 destructuring.  We create a local var called mongoose equal to the mongoose property on the obj, and that obj is going to be the return result from requiring the file we created (mongoose.js)

require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
//var called bodyParser, setting it equal to the return result of requiring body-parser
//The body parser module lets us send JSON to the server.  The server can then take that JSON and do something with it. Body parser essentially parses the body.  It takes the string body and turns it into a JS object.
const {ObjectID} = require('mongodb');

// KEEP LOCAL AND LIBRARY IMPORTS SEPARATE

//by using this we can access anything in mongoose
var {mongoose} = require('./db/mongoose');
//load in todo and user
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');


var app = express();
//this stores our express application, equal to a call to express

const port = process.env.PORT;
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

	// var secondtodo = new Todo({
	// 	text: req.body.text //what we entered into postman
	// 	});
	
	// secondtodo.save().then((doc) => {
	// 	res.send(doc);
	// }, (e) => {
	// 	res.status(400).send(e);
	// });
	
	
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
	//user enters url, last part, the id gets filled into the request object.  we can access it using req.params.id (below)
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
	 //sends an object, the response body, with a todo property
	}).catch((e) => console.log(res.status(400).send('Bad Request')));
		//this is some other error	
});
	//res.send(req.params); 
	//req.params is an obj that has key-value pairs where the key is the url param (like id) and the value is what actual  value is put there.  Here we are asking the response.send method to send back the request.params object.  This is going to let us test out the route inside of postman and see exactly how it works


//to create a delete route:
app.delete('/todos/:id', (req, res) => {
	//the url is the doc that the user wants to delete
	
	//get the id off of the request obj
	var id = req.params.id;
	//validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	//if ID is valid, remove it
	Todo.findByIdAndRemove(id).then((todo) => { 
		//if no doc comes back then nothing was deleted, so doc was not found
		if (!todo) {
			return res.status(404).send();
		}
		res.status(200).send({todo});
		 //send({todo}) sends an object, the response body, with a todo property
	}).catch((e) => {res.status(400).send()});
	
});

//We use the http patch method (what you use when you want to update a resource) to add the new route.
	//STEP 1: create a body var, it has a subset of the things the user passed to us.  we dont want the user to update whatever they want
	//STEP 2: We update the completedat property based off of the completed property and 
	//STEP 3: Make our call with findbyid and update

app.patch('/todos/:id', (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);
	//this is why we need lodash.  the request body is where the updates will be stored. if you want to set a todos text to something else, you would make a patch request, you would set the text property equal to what you want the todo text to be.  the problem is that people can send along properties we don't want them to update or don't even exist. in order to only pull off the properties we want users to be able to edit we use _.pick.  it takes an object, we pass in req.body (which is the body of the existing todo) and then it takes an array of properties you want to pull off, if they exist.  those are the only two properties a user will be able to update

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	//checking the completed value and using that value to set completedat
	if (_.isBoolean(body.completed) && body.completed) {
		//if it is a boolean AND it is true, run fcn
		body.completedAt = new Date().getTime();

	} else {
		body.completed = false;
		body.completedAt = null;
		//when you want to remove a value from a database, you just set it to null
	}

	//query to update the db
	Todo.findByIdAndUpdate(id, 
		//have to use mongodb operators
		{$set: body}, 
		 //this is the body var we set up above
		 {new: true}
			//options that let you tweak how fcn works.  this one tells you to give back the updated obj not the old one
		).then((todo) => {
			if (!todo) {
				return res.status(404).send();
			}

			res.send({todo});
		}).catch((e) => {
			res.status(400).send();
		})
});

//POST /users
//both the signup and login express route handlers are going to require the code to create the auth token.  
app.post('/users', (req, res) => {

	var body = _.pick(req.body, ['email', 'password']);
	//req.body bc the body is the user model, which is what is being requested of in a request when the app.post is called. 
	//the property we peel off from the user model, which we get bc it is stored in the body variable via the _.pick method (from lodash, represented by the _) above which takes only the properties from the user model object that we want the user to be able to modify
	var user = new User(body);
		
		//at first we want to pass in an object with the email and password property.  we could recreate an object, setting the email property equal to body email, but we already have that in body, so we can just pass in body.  there is no reason to pass in an object that we create when we already have the object we need.  The body will at most contain the email and password bc we picked them off, if any of them are missing like the email is not provided, it won't be in the body either, so the validation will fail, so we don't need to worry about creating the object manually. 
		//{ email: body.email,
		// body: body.password }
		 
	user.save().then(() => {
		// res.send(user);
		//instead of responding we call user.generateAuthToken, which we chain on a then call because user.save over in user.js had the token returned to it so we can chain on here, then we return user.generateAuthToken so we can tack on another then call, and this second then call is called with the token value (so basically by returning token in user.js we can pass it on over here, and keep passing it)
		return user.generateAuthToken();
		//if we don't return it we can't use its properties later on
	}).then((token) => {
		res.header('x-auth', token).send(user);
		//we want to send back the token as an http response header.  header takes two arguments, a key:value pair.  When you use x prefix in a header you are creating a custom header, which means it isn't a header http supports by default, it's a header you are using for a specific purpose.  here we are using a jwt token scheme so we're creating a header to store that value.
	}).catch((e) => {
		res.status(400).send(e);
	})
});

//this is the get route for fetching the currently authenticated user.  When the token gets processed, it properly calls the actual route handler, we get the request user and we send it back.  If the token is a bad value we get the errors.
//this route will require authentication (require the x auth token), find the associated user and send the user back
app.get('/users/me', authenticate, (req, res) => { 
	res.send(req.user);
	//to access the middleware you reference the fcn "authenticate"
	// var token = req.header('x-auth');
	// //req.header fetches the value, x-auth is the key

	// //verifying the token, fetch the user and do something with it.  This is the model method.  It takes the token value and finds the appropriate user related to that token, returning it inside of the promise callbacks.  That means we'll be able to do something with the doc of the user associated with the token
	// User.findByToken(token).then((user) => {
	// 	//this corresponds with UserSchema.statics.findByToken in user.js
	// 	if (!user) {
	// 		//this is in the case of a valid token but for some reason we can't find the user

	// 		//instead of res.status(401).send(); we write
	// 		return Promise.reject();
	// 		//the fcn will automatically stop, so res.status(401) doesn't execute we're going to run the error case and send back a 401, which is what we want.
	// 	}
	// 	res.send(user);
	// }).catch((e) => {
	// 	res.status(401).send();
	// 	//send back a 401 status-- auth is required
	// });
	});

//We're creating a login route so that way if someone loses the token or if they sign in from another device the token will be there.  We are trying to find a user in the mongodb collection that matches the email and has a hashed password that matches the plain text pw when passed through the bcrypt compare method.

app.post('/users/login', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			//this generates a token if the user was found from the findByCredential Promise function.  if there's no user the catch case gets fired. Returning this statement keeps the chain alive so that if we do run into any errors into the callback, then 400 will be used as the response
			res.header('x-auth', token).send(user);
			//if a user is found, send back the token to the user
		}); 
		}).catch((e) => {
		res.status(400).send();
	});
	
});

//log out user by deleting token from currently logged in user.  won't need to pass the token value in via the body or some sort of url parameter, instead we make the route private which means you need to be authenticated in order to ever run the code, and inside of our authentication middleware we store it i req.token = token inside of authenticate.js so we can access the token value if we want to later on
app.delete('/users/me/token', authenticate, (req, res) => {
	//to remove the token call instance method
	//we have access to the user via req.user since the user was authenticated.  We define an instance method called removeToken (over in user.js), the token is stores on req.token. We need the method to return a promise bc we're going to need to respond to the user once the token has been deleted 
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}, () => {
		res.status(400).send();
		//this is going to fire if there are any errors
	});
});




//we want to make port dynamic so we use a variable. We use an env var that heroku sets.  Heroku will tell your app what port to use because that port will change as you deply your app, so we use an env var so we don't have to swap out our code every time we want to deploy.  With env var, heroku can set a var on the OS your node app can read that var and use it as the port.  Every OS has lots of env var already built in, heroku just adds to it.


app.listen(port, () => {
	console.log(`Started up at port ${port}`);
});

//above creates a very basic server
module.exports = {app};
//setting it equal to an obj and on that obj we set the app property equal to the app variable.