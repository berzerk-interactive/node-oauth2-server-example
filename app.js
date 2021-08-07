https://github.com/pedroetb/node-oauth2-server-example

var express = require('express'),
	bodyParser = require('body-parser'),
	OAuth2Server = require('oauth2-server'),
	Request = OAuth2Server.Request,
	Response = OAuth2Server.Response;

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.oauth = new OAuth2Server({
	model: require('./model.js'),
	accessTokenLifetime: 60 * 60,
	allowBearerTokensInQueryString: true
});

app.all('/oauth/token', obtainToken);

// app.get('/', authenticateRequest, function(req, res) {

// 	res.send('Congratulations, you are in a secret area!');
// });
app.get('/', function(req, res) {
	console.log(req.query)
	res.send('Congratulations!');
});

//https://protected-hamlet-64205.herokuapp.com/authorize?response_type=code&redirect_uri=https%3A%2F%2Famwelldev.amwell-dev.auth0.com%2Flogin%2Fcallback&state=zJNT0VqOdeemiGwXH1j-wE2TjryUdnza&client_id=application
app.get('/authorize', function(req, res) {
	console.log(req.query)
	if(req.query.redirect_uri){
		console.log(`has redirect URI ${req.query.redirect_uri}`)
		// res.send('authorize!');
		res.redirect(`${req.query.redirect_uri}?code=g0ZGZmNjVmOWIjNTk2NTk4ZTYyZGI3&state=xcoiv98y2kd22vusuye3kch`);
	} else {
		res.send(`you called authorize endpoint without redirect url`)
	}

});
app.get('/secret', authenticateRequest, function(req, res) {

	res.send('Congratulations, you are in a secret area!');
});

app.listen(process.env.PORT || 3000);

function obtainToken(req, res) {

	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.token(request, response)
		.then(function(token) {

			res.json(token);
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}

function authenticateRequest(req, res, next) {

	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.authenticate(request, response)
		.then(function(token) {

			next();
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}

function createAuthorizationCode(req, res, next){
	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.token(request, response)
		.then(function (token) {

			res.json(token);
		}).catch(function (err) {

			res.status(err.code || 500).json(err);
		});
}