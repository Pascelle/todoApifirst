const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

// In order to add seed data for the users collections, we need to create a users array liek we did for todos.  we will also create a populateUsers fcn like we did with todos down below.  Start by loading User model up top with const

//the first is a user with valid authentication, the second is not auth and we can use that user for testing
const userOneId = new ObjectID(); 
const userTwoId = new ObjectID();
const users = [{
	_id: userOneId,
	email: 'Chris@example.com',
	password: 'userOnePass', 
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
	}]
}, {
	_id: userTwoId,
	email: 'jen@example.com',
	password: 'userTwoPass'
	//tokens: [{
		//access: 'auth',
		//token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
	//}]  NEED TO FIX THIS-- CAUSES TEST ERRORS
}];


//an array of objects.  we are using this as our fake collection to test responses
const todos = [{
	_id: new ObjectID(),
	text: 'First test todo'
}, {
	_id: new ObjectID(),
	text: 'Second test todo',
	completed: true,
	completedAt: 333
}];

const populateTodos = (done) => {
	Todo.remove({}).then(() => {
	//Todo.remove MUST HAPPEN FIRST before the return of todo.insertmany(todos), this is a perfect example of async.  Async - when we need something to happen first, or we need something else to happen while we're waiting on the first thing to finish
		return Todo.insertMany(todos);
		//this line says "insert the todos we set up on top so that way the array isnt completely empty; it always starts with 2".  by returning this response the array won't be empty and we are able to chain callbacks
	}).then(() => done());
};

//we have an issue with using insertMany in the populateUsers function. insertMany does not utilize middleware, so when the password is stored, it will be as the plain text password. Because when we run tests it will be assumed that the password was properly hashed, we need to accomodate this:

const populateUsers = (done) => {
	//wipe all the users in the db. pass in an empty array to remove every single record.  
	User.remove({}).then(() => {
		var userOne = new User(users[0]).save();
		//the value that is returned from users.save is stored in userOne
		var userTwo = new User(users[1]).save();
		//before we use then we want to wait for both promises to succeed.  There's a promise utility method that lets us do that, called promise.all.  it will only release the promises once userone and usertwo are successfully resolved (saved to the db)

		return Promise.all([userOne, userTwo])
		//when we return the promise we can tack on the then call that would've been attached to the promise here to the fcn where the promise was returned (here an anonymous fcn)
	}).then(() => done());
}

module.exports = {todos, populateTodos, users, populateUsers};
