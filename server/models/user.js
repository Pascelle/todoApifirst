var mongoose = require('mongoose');

var User = mongoose.model('User', {
	Name: {
		type: String,
		required: true, //this is a validator
		minlength: 1,
		trim: true   //trims off any leading and trailing white space in the value
	},
	Email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	completedAt: {
		type: Number,
		default: null 
	}
});

		/*/ CHALLENEGE /*/ 
// var firstUser = new User ({
// 	Name: 'Casper',
// 	Email: 'Casper@friendlyghost.com',
// 	completedAt: 12
// });

// firstUser.save().then((doc) => {
// 	console.log('Saved User', doc);
// }, (e) => {
// 	console.log('Unable to save user', e)
// });

module.exports = {User};