var{User} = require('./../models/user');
//the variable pulls off user from the return value of require('./../models/user')

var authenticate = (req, res, next) => {
	var token = req.header('x-auth');
	
	User.findByToken(token).then((user) => {
		if (!user) {
			
		}
		req.user = user;
		req.token = token;
		next();
		//instead of sending back the user, we're going to modify the request object.  This means we'll be able to use the modified req obj in app.get over in server.js.
		//req.user is set equal to the user that we just found in the server when the request was made to it
		//req.token equal to the token up above.
		//now that req is modified we'll be able to use that data below by accessing it in app.get over in server.js
		//we can modify app.get by getting rid of all of the code in the middle and replacing it with res.send(req.user);
		//we need to call next or the code in app.get over in server.js will not execute
	}).catch((e) => {
		res.status(401).send();
	});
};

module.exports = {authenticate};
//it's an obj. with property authenticate, value the authenticate variable above