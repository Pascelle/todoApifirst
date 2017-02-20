
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	
	if (err) {
		return console.log('unable to connect to MongoDB server');
	}
	console.log('connected to MongoDB server');

	// db.collection('Todos').find().toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));

	// }, (err) => {
	// 	console.log('unable to fetch todos', err)
	// });
	//every doc from the todos collection.  it returns a cursor that points to those docs.  that cursor has its own methods that we can use, like .toArray (there are other methods available on our cursors, you can find them at the mongodb native docs, api, cursor section).  toArray returns a promise which means we can tack on a then call adding our callback to it and when things go right we can do something like print those docs to the screen
	//.find({completed: false}) to search by completed property
	// in order to search by object ID you need to use the ObjectID constructor fcn (see below)

	// db.collection('Todos').find({
	// 	_id: new ObjectID('58ab4606b5efbe2300f1e3ac')
	// 	}).toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));

	// }, (err) => {
	// 	console.log('unable to fetch todos', err)
	// });

	//below we are counting the todos in the todo collection.  you can use a callback fcn to handle errors or you can use a promise, like we have here:
	// db.collection('Todos').find().count().then((count) => {
	// 	console.log(`Todos count: ${count}`);
	// }, (err) => {
	// 	console.log('unable to fetch todos', err)
	// });
//.find only returns the cursor, in order to actually get the docs we need to use .toArray
		db.collection('Users').find({name: 'Chris'}).toArray().then((docs) => {
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log('unable to fetch users', err)
	});

	//db.close();

});


