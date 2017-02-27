const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
//just call two utility functions when you use jsonwebtoken

var data = {
	id: 10
};

var token = jwt.sign(data, '123abc');
console.log(token);
//jwt.sign method takes the obj and takes the secret, and stores its in the var token.  Var token is what is given to the user when they either sign up or log in.  It's also what will be stored in the tokens array back in user.js.  Access will equal the string off (?) and the token will equal the token we just generated.

var decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);

//if anything about the secret or the token changes before we call verify the call is not going to pass






//jwt.sign takes the obj (the data with the user id here) and signs it.  it creates the hash, then it returns the token value.  


//jwt.verify takes the token and the secret and makes sure the data was not manipulated