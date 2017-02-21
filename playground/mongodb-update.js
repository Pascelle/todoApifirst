
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
		if (err) {
		return console.log('unable to connect to MongoDB server');
	}
	console.log('connected to MongoDB server');


	// //lets us update an item and get the new document back
	// db.collection('Todos').findOneAndUpdate({
	// 	_id: new ObjectID('58ac41c123b8e354a350df35')
	// }, {
	// 	$set: {
	// 		completed: true
	// 	}
	// 	//these are the actual updates we want to apply.  learn about the mongodb update operatprs we need via googling mongodb update operators in the mongodb docs.  the way that you use them is to use the name then set it equal to an object containing the relevant info, in this case whether or not the task is complete
	// }, {
	// 	returnOriginal: false
	// }).then((result) => {
	// 	console.log(result);
	// });

/*/ THE CHALLENGE /*/

db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('58ac33b723b8e354a350d82b')
	}, {
		//all of the operators go inside one big object, the operator name is outside of the brackets
		$set: {
			name: 'Madison'
		}, 
		$inc: {
			age: 1
		}
	},	{
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	});

	//db.close();
});


