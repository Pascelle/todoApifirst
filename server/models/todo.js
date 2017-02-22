var mongoose = require('mongoose');

//creating a model.  create a model for everything we want to store so mongoose knows how to store our data. first argument is the name of the model, second argument is an object that defines the various properties for the model (example: a completed property that has a typeof boolean).  You can find a list of what values (type, etc.) are allowed in the properties by going to the mongoose docs
var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true, //this is a validator
		minlength: 1,
		trim: true   //trims off any leading and trailing white space in the value
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null 
	}
});

		/*/ CHALLENEGE /*/ 
// //run this as a constructor fcn; a new instance of Todo
// var newTodo = new Todo ({
// 	text: 'Cook dinner'
// });
// //save it to the db to update the db.  Save returns a promise, which means we can tack on a then call

// newTodo.save().then((doc) => {
// 	console.log('Saved todo', doc);
// }, (e) => {
// 	console.log('Unable to save todo')
// });

/*/ THE CHALLENGE /*/

// var otherTodo = new Todo ({
// 	//change the name of the var
// 	text: 'Eat a ghost',
// 	completed: false,
// 	completedAt: 12
// });

// otherTodo.save().then((doc) => {
// 	console.log('Saved todo', doc);
// }, (e) => {
// 	console.log('Unable to save todo')
// });

// mongoose validation 
//mongoose schemas

module.exports = {Todo};
