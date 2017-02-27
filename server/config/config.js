var env = process.env.NODE_ENV || 'development';

//environment variable.  If we're on production or test, node_env will be set, but if we're on development (running the app locally) node_env will not be used

if (env === 'development') {
// if we're on development, we want to set up the mongoDB url
process.env.PORT = 3000;
process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
//if it is the test environment, we want a custom db url
process.env.PORT = 3000;
process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
