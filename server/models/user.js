//mongoose middleware lets you run some code beofre or after an event.  Here we want to run code before the doc is saved (the hashed password)
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    //verifies that this email is not already in use
    validate: {
    //makes sure it is a real emails
      validator: validator.isEmail, 

        // (value) => {
        // return validator.isEmail(value);
        //we can also use validator.isEmail, it will get passed the value and it will return true or false.  there's no need to define a custom function
      
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

//this determines what happens when a mongoose model is converted into a JSON value.
UserSchema.methods.toJSON = function (){
  var user = this;
  var userObject = user.toObject();
  //responsible for taking your mongoose var, user, and converting it into a regular obj where only the properties available on the document exist

  return _.pick(userObject, ['_id', 'email']);
};


//this stores the schema for a user, which is all of the properties defined in var user.  We need schema in order to tack on the custom methods

UserSchema.methods.generateAuthToken = function () {
  //setting var user, access and token generates the data we need to complete the user
  var user = this;
  //"this" keyword refers to the document that is being called on when we use an instance method.  for example, in user.generateAuthToken, user is the doc being called on.  Here it is UserSchema.
  var access = 'auth';
  //this links up with the UserSchema.tokens.access property
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  //two arguments with jwt.sign: first is the obj that has the data we want to sign and the second one being a secret value.  eventually the secret is moved into a config var 
  user.tokens.push({access, token});
  //here we update the user tokens array.  tokens is an empty array by default, push lets us add something to that array.  we pass in an object with the vars access and token. this only updates the local user model but we need to save it (below)

  return user.save().then(() => {
    return token;
    //we're returning the token so that later on in the server file we can grab the token by tacking on another then callback.  getting access to the token and then responding inside of the callback fcn (inside of server.js, the return here just allows server.js to chain on the promise)
  });
  //this returns a promise
};
//this creates a method.  Userschema.methods is an object and on this object we can add any method we like---these are our instance methods.  These instance methods have access to the original document created
//cannot use an arrow function here bc arrow fcns do not bind a this keyword.  we need a this keyword for our methods bc the this keyword stores the individual document

UserSchema.statics.findByToken = function (token) {
  //verifying the token
  var User = this;
  //model methods get called with the model as the this binding.
  var decoded;
  //creating an defined var bc the JWT.verify fcn is going to throw an error if anything goes wrong (the secret doesn't match or if the token value was manipulated)

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
   // return a promise that is always going to reject
   return Promise.reject();

   //  return new Promise((resolve, reject) => {
   //    reject()});
      // we can simplify this (see above): 
      // reject() means that this promise will get returned to findByToken.  Then over inside of server.js findByToken will be rejected so our "then" success case will never fire.  The catch callback in server.js will fire though
    
  }
  //with try catch, the code runs in the try block, if something goes wrong there it runs the code in the catch block

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
  //if we're able to verify then fine the users that match
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;
//find user whose email matches the email var we have passed in as arguments.  Have email passed in as a property of an object.  We return it so that we can chain a promise, to correspond with the User.findByCredentials over in server.js which has a then and catch call
 return User.findOne({email}).then((user) => {
  if (!user) {
    return Promise.reject(); //this lines up with the catch call in server.js
  }

  return new Promise((resolve, reject) => {
    //going to compare the user.password property with the password argument passed to the function
    //if the result is true, you find a user, call resolve with user argument passed into the above fcn
    //if result is false, you call reject method which triggers the catch case over inside server.js

    bcrypt.compare(password, user.password, (err, res) => {
      //"password" argument is the plain text password via the password arg up above.  "User.password" is the hashed password, third argument is the callback fcn
        if (res) {
          resolve(user);
          //resolve the promise with the user, which mean swe can do stuff with user over in server.js
        } else {
          reject();
          //reject the promise, sending a 400 black
        }
    });
  })
 })
  
};

UserSchema.pre('save', function (next) {
//must have next argument, and you must call it or the app will crash
  var user = this;
  //gets us access to individual doc

  if (user.isModified('password')) {
    //the goal here is if the PW is actually modified, then you salt and hash it.  if not you move on.

  //First generate a salt using bcrypt.genSalt().  We will get the salt value, which we pass in as an argument to the callback fcn and then use it to call hash.
    bcrypt.genSalt(10, (err, salt) => {
     //plain PW that we have access to via user.password, second argument is salt from the salt var, and the third is the callback fcn where we get the actual hashs value
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
         //remember the user.password property was just equal to the plain text pw so we have to override that in order to properly hide the plain text pw
        next();
      });
    });
  } else {
    next();
  }
//check if the password was modified.  this is important bc there will be times we save the doc without saving the password, which means the password is already hashed.  we don't want to hash the hash or else the app will break, so we use the user.isModified method to let us know if it was modified.  we only want to encrypt the PW if it was just modified.
});

var User = mongoose.model('User', UserSchema);
//we gave User all of its old functionality by passing in UserSchema
  // Name: {
  //  type: String,
  //  required: true, //this is a validator
  //  minlength: 1,
  //  trim: true   //trims off any leading and trailing white space in the value
  // },
//  email: {
//    type: String,
//    required: true,
//    minlength: 1,
//    trim: true,
//    unique: true,
//    //verifies that this email is not already in use
//    validate: {
//    //makes sure it is a real emails
//      validator: validator.isEmail, 

//        // (value) => {
//        // return validator.isEmail(value);
//        //we can also use validator.isEmail, it will get passed the value and it will return true or false.  there's no need to define a custom function
      
//      message: '{VALUE} is not a valid email'
//    }
//  },
//  password: {
//    type: String,
//    require: true,
//    minlength: 6
//  },
//  tokens: [{
//    access: {
//      type: String,
//      required: true
//    },
//    token: {
//      type: String,
//      required: true
//    }
//  }],
// });

  //tokens is an array.  it is a feature available in mongodb that is not avaialble in sql databases.  the array is how we access the tokens for individual users.  in order to set up the schema to support that, we're going to set tokens equal to an array and set up an object inside of it, and that obj will specify all of the properties available on a token

  // completedAt: {
  //  type: Number,
  //  default: null 
  // }

    /*/ CHALLENEGE /*/ 
// var firstUser = new User ({
//  Name: 'Casper',
//  Email: 'Casper@friendlyghost.com',
//  completedAt: 12
// });

// firstUser.save().then((doc) => {
//  console.log('Saved User', doc);
// }, (e) => {
//  console.log('Unable to save user', e)
// });


module.exports = {User}