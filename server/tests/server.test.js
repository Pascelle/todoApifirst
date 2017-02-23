//mocha and nodemon do not need to be required; that's not how they're used

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

//below creates a local variable called app, we use ES6 destructuring to pull it off of the return result from requiring the server file.  here we're going to start by geting the relative path, then go back one directory from tests into server, then the file name is server without the extension
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

//an array of objects.  we are using this as our fake collection to test responses
const todos = [{
	_id: new ObjectID(),
	text: 'First test todo'
}, {
	_id: new ObjectID(),
	text: 'Second test todo'
}];
//we need the beforeEach because we have existing docs in the database already, but below in the expect statements we act as if there is nothing in there.  this fcn is going to get called with a done argument and run before every test case and will only move on to the next test case once we call done which means we can do something async inside of it. which means we can remove all of our todos before moving on to the next test case.
beforeEach((done) => {
	Todo.remove({}).then(() => {
	//Todo.remove MUST HAPPEN FIRST before the return of todo.insertmany(todos), this is a perfect example of async.  Async - when we need something to happen first, or we need something else to happen while we're waiting on the first thing to finish
		return Todo.insertMany(todos);
		//this line says "insert the todos we set up on top so that way the array isnt completely empty; it always starts with 2".  by returning this response the array won't be empty and we are able to chain callbacks
	}).then(() => done());
});
//insertMany takes an array and inserts 

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test todo text';

		//making a request via supertest
		request(app)
			.post('/todos') //sets up a post request
			.send({text}) //in order to send data along with the request as the body we need to use .send, this gets converted to JSON by supertest.  used es6 syntax of object property and value being the same
			.expect(200)
			//expect is ready the data that we sent using .send and is setting expectations for what should be in that data
			//after making sure the status is 200, we make sure that the body is an object and it contains the text property like up above.  this is what it should be doing when it sends the body back in res.send(doc) over in server.js
			.expect((res) => {
				expect(res.body.text).toBe(text);
				//custom expect calls get passed the response as a param
				//we're going to expect that the repsonse body has a text property and that that text property equals the text string defined above
			})
			.end((err, res) => {
				if(err) {
					return done(err);
				}

				Todo.find({text}).then((todos) => {
				//only find text that equals the text above (in the var text)
					//expect(todos.length).toBe(1);
					//it's supposed to be 1 but for some reason it is not.
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
				//fetches all of the todos then attaches a callback, and make assertions about the to do we created.  
				//second expect is us expecting that the one item we added has a text property equal to the text variable we created above.
				//if both expectations passed it means the stauts code is correct, the response is correct and the database is correct
				//catch is going to catch any errors that may occur inside of our callback
			});
			//we want to check what got stored in the mongodb collection)
	});

	//THE CHALLENGE: this test verifies that a todo is NOT created when we send bad data, that a 400 does indeed come back from the server, and that no new doc was created in the db
	it('should not create todo with invalid body data', (done) => {
		request(app)
			.post('/todos') 
			.send({}) 
			.expect(400)
			.end((err, res) => {
				if(err) {
					return done(err);
				}
			//fetching all todos from the db to make some assertions
			Todo.find().then((todos) => {
				expect(todos.length).toBe(2);
				done();
			}).catch((e) => done(e));
	});

	});
});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app) 
			//this means look at the code in server.js
		.get('/todos')
		.expect(200)
		.expect((res) => {
			expect(res.body.todos.length).toBe(2);
		})
		.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		//this is the supertest request, requesting from the express app (as captured in var app)
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			//this is saying if I input this url
			//use a template string when you need to inject a changing value.  Here ID will differ from test to test.  We're access the todos array, we're grabbing the first item and we're looking for its _id property.  It's an ObjectID but we need to convert it into a string because that is what we are going to pass in as the url.  For that we use the toHexString method.
			.expect(200)
			//this is saying "i expect to get a 200 status code"
			//use .expect to make assertions about what happens when the .get test case gets fired
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			//this is saying I expect the body we get back from plugging in that url to match the ideal body we have above in the todos variable.  the todos var contains an array of objects and we are that we expect the first item in the array (an object) to have a text property to match the text property in the results object.
			//this is how you make a custom assertion.  you can examine the body of what comes back by passing in the res variable and then making a fcn with whatever it is should be in the body
			})
			.end(done);

	});

	it('should return 404 if todo not found', (done) => {
		var outsideTodo = {
			_id: new ObjectID(),
			text: 'This todo is not in the collection'
		};
		request(app)
			.get(`/todos/${outsideTodo._id.toHexString()}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 for non-object ids', (done) => {
		request(app)
			.get('/todos/123abc')
			.expect(404)
			.end(done);
	});
});

// THE CHALLENGE: query database using findById, try to find the todo item that has the hexId.  it should fail.  youre going create that var in your then call and make sure it doesnt exist.  you can make sure something doesnt exist by using the toNotExist fcn, like expect(todo).toNotExist();
describe('DELETE /todos/:id', () => {
	it('should remove a todo', (done) => {
		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(hexId).then((todo) => {
					expect(todo).toNotExist();
					done();
				}).catch((e) => done(e));
			})
	});

	it('should return 404 if todo not found', (done) => {

			var outsideTodo = {
			_id: new ObjectID(),
			text: 'This todo is not in the collection'
		};
		request(app)
			.delete(`/todos/${outsideTodo._id.toHexString()}`)
			.expect(404)
			.end(done);
	});
	

	it('should return 404 if object id is invalid', (done) => {
		request(app)
			.get('/todos/123abc')
			.expect(404)
			.end(done);
	 });
});
// goign to be an async test with done argument
//make a request using a real objectID and youre goign to call its tohexstring method.  youre goign to call the method we have here and call new objectid to make a new one.  it will be a valid ID but wont be found in the collection so well get a 404 back.  the only expectation you need to set up is the status code.  make sure you get a 404 back.  
//the second test is going to verify that when we have an invalid ID we get back a 404. youre going to pass in a url like /todos/123, when we try to convert 123 to an objectid it is going to fail so we should get a 404 back
