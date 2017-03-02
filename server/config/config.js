var env = process.env.NODE_ENV || 'development';

//environment variable.  If we're on production or test, node_env will be set, but if we're on development (running the app locally) node_env will not be used

//LATER: Instead of defining the environment variables we are simply going to load them in if we're on the test or development environment. It is in the if (env === 'development' || env === 'test') statement below:

if (env === 'development' || env === 'test') {
	//when you require JSON it automatically parses it into a JS object.  We dont need to use json.parse to get it done.  which means we can create a var config here.  now we have access to the config object
	var config = require('./config.json');
	var envConfig = config[env]; 
	//remember env is in the if statement above
	//this allows us to just grab the env vars for the environment we are CURRENTLY in.  
	//When you want to use a var to access a property you have to use bracket notation.  We connect this and the object properties over in config.json via the Object.keys method below.  
	//Here config[env] refers to the properties in the test or development objects over in config.json

	//BELOW: The point of this is to set the environment variable over in config.json.  We need to access the properties over in config.json.  Object.keys takes an object, like envConfig, it gets all of the keys and returns them as an array.  Then we can just loop over the array and do something to each item.  Here we are calling forEach with a callback fcn as its argument and that callback fcn gets called with each item that we call key (here a key of port and a key of mongouri).  We can then set process.env.[key] (the environment variable) equal to whatever the value is in envConfig and we're going to grab the value for the key this way.

	Object.keys(envConfig).forEach((key) => {
		process.env[key] = envConfig[key];
		//if the key is port we're setting the port property on env, if the key is mongodb_uri we're settin that property on env.  We're setting it equal to the value in envConfig[key] (found in config.json)
		
	});

		//SIMPLIFIED VERSION: GRAB AND THEN SET.  First we GRAB just the env vars (that would be the inner object in config.json containing port and mongodb_uri) for the environment we're currently in.  We do that via envConfig which stores just the config vars for the current env.  So with config[env], if env is equal to test we are going to grab the test property, if env is equal to dev we are goign to grab the dev property.  Then we SET the value of the env vars INSIDE of whatever proeprty we grabbed using Object.keys
 
}

// if (env === 'development') {
// // if we're on development, we want to set up the mongoDB url
// process.env.PORT = 3000;
// process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
// //if it is the test environment, we want a custom db url
// process.env.PORT = 3000;
// process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
