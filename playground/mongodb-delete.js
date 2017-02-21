
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
		if (err) {
		return console.log('unable to connect to MongoDB server');
	}
	console.log('connected to MongoDB server');

	// deleteMany lets us target many docs and remove them
	// db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result) => {
	// 	console.log(result);
	// });
	// deleteOne: deletes the first item that matches the criteria and then it stops

	// db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) => {
	// 	console.log(result);
	// });

	// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
	// 	console.log(result);
	// });

	//findOneAndDelete lets you remove and individual item and it also returns those values.  if you want to delete a todo you can do that but you also get the obj back so if you want to tell the user which one was deleted you can do that.  this method actually gets a document back rather than just a result object with a result and n property, so we can use .then a print the doc to the screen

	/*/ THE CHALLENGE /*/

		// db.collection('Users').deleteMany({name: 'Pascelle'}).then((result) => {
		// console.log(result);
		// });

		db.collection('Users').findOneAndDelete({_id: new ObjectID('58ab4a624fbfd13084ecaca9')}).then((result) => {
			console.log(result);
		})


	//db.close();

});


