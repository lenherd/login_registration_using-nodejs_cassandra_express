A basic login-registration example using cassandra.

To get it working
1. Install express
2. Install cassandra driver 
3. Install the following additional dependencies in your package.json
    "connect-flash" : "*",  --> used for flash messages
    "express-handlebars" : "*", --> required if you wanna use .handlebar pages instead of ejs.
    "express-session" : "*",
    "express-messages" : "*",
    "express-validator" : "*",  --> to validate forms

Additional requirements before running the project
1. Create a keyspace in cassandra and give the same keyspace name in the js file that it would be required
Note:  You can use DataStax Dev center to create the keyspace, if you dont wish to use the cql shell.
2. Create the tables in advance

RUN using
node app.js





