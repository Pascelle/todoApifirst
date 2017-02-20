//we start by loading in the library and connecting to the db.  first we need to install the library

//get the mongo client, which lets you connect to mongo server and issue commands to manipulate the db

// const MongoClient = require('mongodb').MongoClient; we destructure it right below:

const {MongoClient, ObjectID} = require('mongodb');
//to destructure we remove .mongoclient because we dont need to access the mongoclient attribute
//by putting curly braces around MongoClient, we can pull off any properties from the mongodb library.  in this case it is MongoClient.  This creates a var called mongoclient setting it equal to the mongoclient property of mongodb.  we can pull of more stuff by adding a ,
//ObjectID is a constructor fcn that allows us to create new object IDs on the fly, even if we dont us mongoDB.  it is useful for unique identification.

var obj = new ObjectID();
console.log(obj);



 // below is an ES6 feature known as object destructuring which lets you pull out properties from an object and store it in a variable;  ex:

//  var user = {name: 'andrew', age: 25};
// var {name} = user;
// console.log(name);



//below is a method that connects us to the db.  it takes two argument: the url where your db lives (in a production example this might be amazon web services url or heroku url), the second will be a callback fcn that fires after the connection either succeeds or fails

//we can create a database and connect to it just by naming it here, but mongo will not create a db until we start adding data into it.
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	//the db obj is what we can use to issue commands to read and write data
	if (err) {
		return console.log('unable to connect to MongoDB server');
		//we add the return statement to keep the rest of the code from executing which will stop the connected to mongodb server message from reading.  or we can just use an else stmt
	}
	console.log('connected to MongoDB server');

	//this inserts a new record into a collection.  we're going to have two collections: todo collection and users collection

	//this creates a collection.  insertone lets you insert a new document into your collection it takes two arguments: an obj that stores the key value pairs we want to have on our doc, the second is a callback that gets fired when things fail or go well
	// db.collection('Todos').insertOne({
	// 	text: 'Something to do',
	// 	completed: false,
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert todo', err);
	// 	}

	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// 	//the ops attribute stores all of the docs that were inserted. undefined is for the filter fcn, 2 is for indentation
	// });

	// db.collection('Users').insertOne({
	// 	name: 'Pascelle',
	// 	age: 33,
	// 	location: 'NY'
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert user', err);
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 2))
	// 	;  //result.ops[0]._id prints the object id.  When can chain on to that .getTimestamp() to return the timestamp that the object id was created at
	// });

	db.close();
	//disconnect from the server
});


