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

// This is used to make HTTP requests with nodejs
var request = require('request');

// This is used for File Operations
var fs = require('fs');

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
var username = null;
var password = null;
var sernum = null;
var	usermessage = '';

// Renders and Redirects
app.get('/',function(req, res){
	res.render('index', {
		message: usermessage
	});
	username = null;
	password = null;
	usermessage = '';
});

app.post('/',function(req, res){
	if (req.body.username=="" || req.body.password=="") {
		usermessage='Please enter both Username and Password';
		res.render('index', {
			message: usermessage
		});
		username = null;
		password = null;
		usermessage = '';
	} else {
		username = req.body.username;
		password = req.body.password;
		request.get('https://www.httpwatch.com/httpgallery/authentication/authenticatedimage/default.aspx',
			{ 'auth': {
		    			'user': username,
		    			'pass': password,
		    			'sendImmediately': false
		    		}		    		    
			}, function(error, response, body){
		    	if(error || response.statusCode != 200) {
				usermessage='Your credentials are incorrect or You are not authorized';
				res.render('index', {
					message: usermessage
				});
				username = null;
				password = null;
				usermessage = '';
		    	} else {
		    		res.render('app',{
					jsonData: null,
					message: usermessage,
					sernum: sernum,
					jsonFile: null
		});		    		
		    }
		});
	}	
});

app.post('/app',function(req, res){
	if (req.body.sernum=="") {
		usermessage='Please enter serial number';
		res.render('app', {
			jsonData: null,
			message: usermessage,
			sernum: null,
			jsonFile: null
		});
		usermessage = '';
	} else {
		sernum = req.body.sernum;
		request.get('https://learnwebcode.github.io/json-example/animals-' + sernum + '.json',
			{ 'auth': {
		    			'user': username,
		    			'pass': password,
		    			'sendImmediately': false
		    		}		    		    
			}, function(error, response, body){
		    	if(error || response.statusCode != 200) {
				usermessage='Something went wrong while accessing api - ';
				req.body.sernum = '';
				res.render('index', {
					message: usermessage + error
				});
				username = null;
				password = null;
				usermessage = '';
		    	} else {
			    		try{
			    		fileContents = fs.readFileSync("./public/files/myfile.json");
			    		if(fileContents == "")
			    		{
			    		var jsonFile = { records: [] };
			    		}
			    		else
			    		{
			    		jsonFile = JSON.parse(fileContents);
			    		}
			    		jsonData = JSON.parse(body);
			    		newname = jsonData[0].name;
			    		newspecies = jsonData[0].species;
			    		jsonFile.records.push({name: newname, species: newspecies});
			    		fs.writeFileSync("./public/files/myfile.json",JSON.stringify(jsonFile), null, 2);
			    		res.render('app', {
			    			jsonData: JSON.parse(body),
			    			message: null,
			    			sernum: sernum,
			    			jsonFile: JSON.parse(fs.readFileSync("./public/files/myfile.json")),
			    		});} catch(error){
			    		usermessage='Something went wrong while parsing response. '
			    		res.render('app', {
			    			jsonData: null,
			    			sernum: sernum,
							message: usermessage + error,
							jsonFile: null
						});
						username = null;
						password = null;
						usermessage = '';
						jsonFile = null;	
			    		}	    		
		    }
		});
	}	
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
