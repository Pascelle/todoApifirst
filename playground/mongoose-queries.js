//you can find more info at mongoosejs.com/docs/queries

//if it ever can't find the doc id, it will return null

const {ObjectID} = require('mongodb');
//make a const called objID and we're going to get it from the mongoDB librarys
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '58adf502db1bbb3de816dd12';

if (!ObjectID.isValid(id)) {
	console.log('ID not valid');
}
//isValid takes the value and returns true if its valid and false if it is not, which means we can ad if conditions before we ever run the query

// Todo.find({
// 	_id: id
// 	//mongoose will tak`e the string, convert it to an objectID, then it will run the query.  no need to manually convert our string to an objectID
// }).then((todos) => {
// 	//todos will be an array of documents
// 	console.log('Todos', todos);
// });

// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log('Todos', todo);
// });

Todo.findById(id).then((todo) => {
	if (!todo) {
		//this is if the id is not found in the db
		return console.log('Id not found!');
	}
	console.log('Todo by Id', todo);
}).catch((e) => console.log(e));
//catch is for if there is some other error entirely

/*/ THE CHALLENGE /*/

var id = '58ac93340fec3f2d20f55858';

User.findById(id).then((user) => {
	if (!user) {
		//this is if the id is not found in the db
		return console.log('user not found!');
	}
	console.log(JSON.stringify(user, undefined, 2));
	//if the user was found, print it to the screen
}).catch((e) => console.log(e));
//this is if there is some other error.


