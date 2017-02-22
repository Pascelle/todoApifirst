//mocha and nodemon do not need to be required; that's not how they're used

const expect = require('expect');
const request = require('supertest');

//below creates a local variable called app, we use ES6 destructuring to pull it off of the return result from requiring the server file.  here we're going to start by geting the relative path, then go back one directory from tests into server, then the file name is server without the extension
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

//we need the beforeEach because we have existing docs in the database already, but below in the expect statements we act as if there is nothing in there.  this fcn is going to get called with a done argument and run before every test case and will only going to move on to the test case once we call done which means we can do something async inside of it. which means we can remove all of our todos before moving on to the next test case.
beforeEach((done) => {
		Todo.remove({}).then(() => done());
});

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
					Todo.find().then((todos) => {
						expect(todos.length).toBe(1);
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
				expect(todos.length).toBe(0);
				done();
			}).catch((e) => done(e));
	});

	});
});

