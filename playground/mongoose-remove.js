

const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//Mongoose gives us three methods for deleting our records.  The first is Todo.remove-- it will remove whatever in the db matches the query.  You can't pass in any empty argument to remove all docs.  To remove everything you need to do this:

	// Todo.remove({}).then((result) => {
	// 	console.log(result)
	// });
//does not return the removed doc itself

//Other ways to remove docs:

//	1) Todo.findOneAndRemove()
		//will remove then return the doc so you can print to screen or send back to user

//  2) Todo.findByIdAndRemove()

Todo.findOneAndRemove({_id: '58af453afbad9074e36d901d'}).then((todo) => {

});

Todo.findByIdAndRemove('58af453afbad9074e36d901d').then((todo) => { console.log(todo);

});