/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// This application uses body-parser middleware
var bodyParser = require('body-parser');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// View Engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// Global Variables
var	usermessage = null;

// Renders and Redirects
app.get('/',function(req, res){
	res.render('index', {
		message: usermessage
	});
});

app.post('/',function(req, res){
	if (req.body.username=="" || req.body.password=="") {
		usermessage='Please enter both Username and Password';
		res.render('index', {
			message: usermessage
		});
	} else {
		res.render('app');
	}	
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
