/**
 * Configuration.
 */

var config = {
	clients: [{
		id: 'application',	// TODO: Needed by refresh_token grant, because there is a bug at line 103 in https://github.com/oauthjs/node-oauth2-server/blob/v3.0.1/lib/grant-types/refresh-token-grant-type.js (used client.id instead of client.clientId)
		clientId: 'application',
		clientSecret: 'secret',
		grants: [
			'password',
			'refresh_token',
			'authorization_code'
		],
		redirectUris: []
	}],
	confidentialClients: [{
		clientId: 'confidentialApplication',
		clientSecret: 'topSecret',
		grants: [
			'password',
			'client_credentials'
		],
		redirectUris: []
	}],
	tokens: [],
	codes: ['g0ZGZmNjVmOWIjNTk2NTk4ZTYyZGI3'],
	users: [{
		username: 'pedroetb',
		password: 'password'
	}]
};

/**
 * Dump the memory storage content (for debug).
 */

var dump = function() {

	console.log('clients', config.clients);
	console.log('confidentialClients', config.confidentialClients);
	console.log('tokens', config.tokens);
	console.log('tokens', config.codes);
	console.log('users', config.users);
};

/*
 * Methods used by all grant types.
 */

var getAccessToken = function(token) {

	var tokens = config.tokens.filter(function(savedToken) {

		return savedToken.accessToken === token;
	});

	return tokens[0];
};

var getClient = function(clientId, clientSecret) {

	var clients = config.clients.filter(function(client) {

		return client.clientId === clientId && client.clientSecret === clientSecret;
	});

	var confidentialClients = config.confidentialClients.filter(function(client) {

		return client.clientId === clientId && client.clientSecret === clientSecret;
	});

	return clients[0] || confidentialClients[0];
};

var saveToken = function(token, client, user) {

	token.client = {
		id: client.clientId
	};

	token.user = {
		username: user.username
	};

	config.tokens.push(token);

	return token;
};

/*
 * Method used only by password grant type.
 */

var getUser = function(username, password) {

	var users = config.users.filter(function(user) {

		return user.username === username && user.password === password;
	});

	return users[0];
};

/*
 * Method used only by client_credentials grant type.
 */

var getUserFromClient = function(client) {

	var clients = config.confidentialClients.filter(function(savedClient) {

		return savedClient.clientId === client.clientId && savedClient.clientSecret === client.clientSecret;
	});

	return clients.length;
};

/*
 * Methods used only by refresh_token grant type.
 */

var getRefreshToken = function(refreshToken) {

	var tokens = config.tokens.filter(function(savedToken) {

		return savedToken.refreshToken === refreshToken;
	});

	if (!tokens.length) {
		return;
	}

	return tokens[0];
};

var revokeToken = function(token) {

	config.tokens = config.tokens.filter(function(savedToken) {

		return savedToken.refreshToken !== token.refreshToken;
	});

	var revokedTokensFound = config.tokens.filter(function(savedToken) {

		return savedToken.refreshToken === token.refreshToken;
	});

	return !revokedTokensFound.length;
};

/*
 * Method used only by authorization_code grant type.
 */

var getAuthorizationCode = function (code) {

	var codes = config.codes.filter(function (savedCode) {
		return savedCode === code;
	});

	if (!codes) {
		return;
	}

	// return codes[0];
	return {
		code: code.authorization_code,
		expiresAt: code.expires_at,
		redirectUri: code.redirect_uri,
		scope: code.scope,
		client: client, // with 'id' property
		user: user
	};
	// imaginary DB queries
	// db.queryAuthorizationCode({ authorization_code: authorizationCode })
	// 	.then(function (code) {
	// 		return Promise.all([
	// 			code,
	// 			db.queryClient({ id: code.client_id }),
	// 			db.queryUser({ id: code.user_id })
	// 		]);
	// 	})
	// 	.spread(function (code, client, user) {
	// 		return {
	// 			code: code.authorization_code,
	// 			expiresAt: code.expires_at,
	// 			redirectUri: code.redirect_uri,
	// 			scope: code.scope,
	// 			client: client, // with 'id' property
	// 			user: user
	// 		};
	// 	});

};

var revokeAuthorizationCode = function(code, callback) {
	
}
/**
 * Export model definition object.
 */

module.exports = {
	getAccessToken: getAccessToken,
	getClient: getClient,
	saveToken: saveToken,
	getUser: getUser,
	getUserFromClient: getUserFromClient,
	getRefreshToken: getRefreshToken,
	revokeToken: revokeToken,
	getAuthorizationCode: getAuthorizationCode,
	revokeAuthorizationCode: revokeAuthorizationCode,
};
