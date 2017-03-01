
//to hash a value, we pass it into the SHA256 function

var message = 'I am user number 3';
var hash = 	SHA256(message).toString();
//the resulting value from sha256 is an obj so we convert it to a string
console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

//var data is the data we want to send back from the server to the client.  We need to make sure that the client does not then send back a different ID like, i was id #4 but now im saying im id #5 and i want access.  This is what tokens are for.  Tokens contain a data property set equal to the data var below, then it has a hash property which is the hash value of the data.

var data = {  
	id: 4
};

//var data comes from the server and lets us know what user should be able to make the request

var token = {
	data,
	//this is the login info that matches with the below hash
	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
	//the hash property is going to be the hashed value of the data.  If the data changes later on and we rehash it, we're not going to get the same value back so we'll be able to tell that the data was manipulated by the client and we should not expect it to be valid
	//salting a hash means you add something on to a hash that is unique that changes the value.  for ex/ if i hash the string password, i will get the same hash every time.  but if i salt the hash with xyzabc one time and then 123hgb the next time, there is always something different at the end.  In the example above somesecert is the salt
}

//how to verify that the token was not manipulated:  resultHash stores the hash of the data that comes back, the data that may or may not have been manipulated

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();	
	//we're going to access the data and then hash it and then salt it (toString so we can get back our string value)

	if (resultHash === token.hash) {
		console.log('Data was not changed');
	} else {
		console.log('Data was changed. Do not trust!');
	}

	//if this is true we know the data wasn't manipulated bc of the salt

	//Salt is a random string appended to the end of a user’s password before the password is hashed.  

//three parts to a JWT, though we only edit the payload.  The header stores things like the algorithm we used and the type.  The payload has the thing we set and the issued at time stamp.  In the verification that is where the algo is executed and the hash is stored.
