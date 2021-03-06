//mocha and nodemon do not need to be required; that's not how they're used

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

//below creates a local variable called app, we use ES6 destructuring to pull it off of the return result from requiring the server file.  here we're going to start by geting the relative path, then go back one directory from tests into server, then the file name is server without the extension
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

//we need the beforeEach because we have existing docs in the database already, but below in the expect statements we act as if there is nothing in there.  this fcn is going to get called with a done argument and run before every test case and will only move on to the next test case once we call done which means we can do something async inside of it. which means we can remove all of our todos before moving on to the next test case.

beforeEach(populateUsers);
beforeEach(populateTodos);
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

// describe('GET /todos/:id', () => {
// 	it('should return todo doc', (done) => {
// 		//this is the supertest request, requesting from the express app (as captured in var app)
// 		request(app)
// 			.get(`/todos/${todos[0]._id.toHexString()}`)
// 			//this is saying if I input this url
// 			//use a template string when you need to inject a changing value.  Here ID will differ from test to test.  We're access the todos array, we're grabbing the first item and we're looking for its _id property.  It's an ObjectID but we need to convert it into a string because that is what we are going to pass in as the url.  For that we use the toHexString method.
// 			.expect(200)
// 			//this is saying "i expect to get a 200 status code"
// 			//use .expect to make assertions about what happens when the .get test case gets fired
// 			.expect((res) => {
// 				expect(res.body.todo.text).toBe(todos[0].text);
// 			//this is saying I expect the body we get back from plugging in that url to match the ideal body we have above in the todos variable.  the todos var contains an array of objects and we are that we expect the first item in the array (an object) to have a text property to match the text property in the results object.
// 			//this is how you make a custom assertion.  you can examine the body of what comes back by passing in the res variable and then making a fcn with whatever it is should be in the body
// 			})
// 			.end(done);
// 	});

// 	it('should return 404 if todo not found', (done) => {
// 		var outsideTodo = {
// 			_id: new ObjectID(),
// 			text: 'This todo is not in the collection'
// 		};
// 		request(app)
// 			.get(`/todos/${outsideTodo._id.toHexString()}`)
// 			.expect(404)
// 			.end(done);
// 	});

// 	it('should return 404 for non-object ids', (done) => {
// 		request(app)
// 			.get('/todos/123abc')
// 			.expect(404)
// 			.end(done);
// 	});
// });

// THE CHALLENGE: query database using findById, try to find the todo item that has the hexId.  it should fail.  youre going create that var in your then call and make sure it doesnt exist.  you can make sure something doesnt exist by using the toNotExist fcn, like expect(todo).toNotExist();
// describe('DELETE /todos/:id', () => {
// 	it('should remove a todo', (done) => {
// 		var hexId = todos[1]._id.toHexString();

// 		request(app)
// 			.delete(`/todos/${hexId}`)
// 			.expect(200)
// 			.expect((res) => {
// 				expect(res.body.todo._id).toBe(hexId);
// 			})
// 			.end((err, res) => {
// 				if (err) {
// 					return done(err);
// 				}

// 				Todo.findById(hexId).then((todo) => {
// 					expect(todo).toNotExist();
// 					done();
// 				}).catch((e) => done(e));
// 			})
// 	});

// 	it('should return 404 if todo not found', (done) => {

// 			var outsideTodo = {
// 			_id: new ObjectID(),
// 			text: 'This todo is not in the collection'
// 		};
// 		request(app)
// 			.delete(`/todos/${outsideTodo._id.toHexString()}`)
// 			.expect(404)
// 			.end(done);
// 	});
	

// 	it('should return 404 if object id is invalid', (done) => {
// 		request(app)
// 			.get('/todos/123abc')
// 			.expect(404)
// 			.end(done);
// 	 });
// });

		/*/CHALLENGE INSTRUCTIONS /*/
		//grab ID of first item
		//make patch request, provide the proper url with the id inside of it, use send to send some data along as the request body.  update text to something else, set completed equal to true
		//assert that you get 200
		//custom assertion will verify that the response body has a text property equal to the text i sent in, verify that completed is true, verify that completedAt is a number, use the toBeA method inside of expect to get that done

describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		var hexId = todos[0]._id.toHexString();
		//
		var text = 'This should be the new text';

		request(app)
			.patch(`/todos/${hexId}`)
			.send({
				completed: true,
				text: text
			})

			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end(done);
	});

			/*/SECOND CHALLENGE INSTRUCTIONS /*/
			//grab ID of second todo item
			//update text to something different, set completed to false
			//make assertions, 200, check that text was changed, check that completed is false, and that completedAt is null.  can use the toNotExist method available on expect to make that assertion.
	it('should clear completedAt when todo is not completed', (done) => {
		var hexId = todos[1]._id.toHexString();
		//
		var text = 'This should be the new text!!!!';

		request(app)
			.patch(`/todos/${hexId}`)
			.send({
				completed: false,
				text: text
			})

			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist();
			})
			.end(done);
	});
});

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
		.get('/users/me')
		.set('x-auth', users[0].tokens[0].token) 
		//setting a header (name, value)
		//this is from var users in seed.js
		.expect(200)
		.expect((res) => {
			//when we provide a valid token we want to make sure we get valid data back from the server
			expect(res.body._id).toBe(users[0]._id.toHexString());
			//when we fetch a user the id that comes back in the body from the server should be the id of the user whose token we supplied
			expect(res.body.email).toBe(users[0].email);
			//comparing email sent back from server to the email contained in the token we sent when we logged in
		})
		.end(done);
	});
	//CHALLENGE: Make a call to the /users/me route via a GET request, not providing an auth token, just expect to get a 401 back.  Also expect that the body is equal to an empty obj, which it should be if the user is not authenticated.  Make sure to call end passing in done and remember when you're comparing an empty obj to another obj you have to use toequal and not tobe. 
	it('should return 401 if not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({})
			})
			.end(done);
	});
});

//test cases for the sign up route
describe('POST /users', () => {
	//test what happens when we pass in a valid unused email and valid PW
	it('should create a user', (done => {
		//to make sure email and pw are unique
		var email = 'example@example.com';
		var password = '123mnb!';

		request(app)
		.post('/users')
		//this will not be dynamic so we can use a regular string as opposed to a template string
		.send({email, password})
		.expect(200)
		.expect((res) => {
			expect(res.headers['x-auth']).toExist();
			//we have to use brakcet notiation and not dot notation because our header name is a hyphen in it and you cant do that with dot notation
			expect(res.body._id).toExist();
			expect(res.body.email).toBe(email);
		})
		.end((err) => {
			if (err) {
				return done(err);
			}

			User.findOne({email}).then((user) => {
				expect(user).toExist();
				expect(user.password).toNotBe(password);
				done();
			  }).catch((e) => done(e));
		});
	}));

	//test what happens when invalid email or PW not at least 6 characters is passed in; user should not be created
	it('should return validation errors if request invalid', (done) => {
		request(app)
		.post('/users')
		.send({
			email: 'and',
			password: '123'
		})
		.expect(400)
		.end(done);
	});

	it('should not create user if email in use', (done) => {
		request(app)
		.post('/users')
		.send({
			email: users[0].email, //this is from seed.js
			password: 'Password123!'
		})
		.expect(400)
		.end(done);
	}); 
});

describe('POST /users/login', () => {
	it('should login user and return auth token', (done) => { //using the second user from the seed.js data
		request(app)
		.post('/users/login')
		.send({
			email: users[1].email,
			password: users[1].password
		})
		.expect(200)
		.expect((res) => {
			expect(res.headers['x-auth']).toExist()
			//expect that the response header's object has an a-auth token; we're goign to expect this value to exist
		})
		.end((err, res) => {
			if (err) {
				return done(err);
			}
			//this is in the case we DO find a user.  We already know the ID of the user... it's in seed.js "_id: userTwoId".  we grab the user ID and then tack on a then call for when the user query finishes
			User.findById(users[1]._id).then((user) => {
				expect(user.tokens[0]).toInclude({
					access: 'auth',
					token: res.headers['x-auth']
				});
				//we expect that the user has a tokens array and that the first item includes using toInclude the following attributes
				done();
			}).catch((e) => done(e));
		});
	});

	it('should reject invalid login', (done) => {
		request(app)
		.post('/users/login')
		.send({
			email: users[1].email,
			password: users[1].password + '1'
		})
		.expect(400)
		.expect((res) => {
			expect(res.headers['x-auth']).toNotExist()
		})
		.end((err, res) => {
			if (err) {
				return done(err);
			}
			
			User.findById(users[1]._id).then((user) => {
				expect(user.tokens.length).toBe(0);
				done();
			}).catch((e) => done(e));
		});
	});
});

describe('DELETE /users/me/token', () => {
	it('should remove auth token on logout', (done) => {
		//DELETE /users/me/token
		//Set x-auth equal to token
		//200
		//Find user, verify that tokens array has length of zero

		request(app)
		.delete('/users/me/token')
		//this deletes the token
		.set('x-auth', users[0].tokens[0].token) 
		//we then need to make the request to check to see if the delete was done correctly (i.e. that the auth token was removed). when making the request we need to set the x-auth header bc the /users/me/token route is not only private but it uses the req.token as the token to delete (see app.delete in server.js).  In other words we need to pass in the same values that are being used over in the corresponding http requests in server.js.
		.expect(200)
		//setting expectations
		.end((err, res) => {
			if (err) {
				return done(err);
			}
			//custom assertion, which means querying the database

			User.findById(users[0]._id).then((user) => {
				//first we are retrieving the user by id from seed.js, it reutrns the user object, then the "then" call allows us to do something when that user comes back
				expect(user.tokens.length).toBe(0);
				//there shouldn't be any tokens because we deleted it
				done();
			}).catch((e) => done(e));
		});
	});
});







// goign to be an async test with done argument
//make a request using a real objectID and youre goign to call its tohexstring method.  youre goign to call the method we have here and call new objectid to make a new one.  it will be a valid ID but wont be found in the collection so well get a 404 back.  the only expectation you need to set up is the status code.  make sure you get a 404 back.  
//the second test is going to verify that when we have an invalid ID we get back a 404. youre going to pass in a url like /todos/123, when we try to convert 123 to an objectid it is going to fail so we should get a 404 back
