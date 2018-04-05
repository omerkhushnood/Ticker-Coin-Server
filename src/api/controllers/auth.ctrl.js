'use strict';

var jwt = require('jsonwebtoken'),
	JWT_SECRET = process.env.JWT_SECRET
;

//
// Verifies access token in authorization header.
exports.authenticate = function(req, res, next){

	var accessToken = null,
		authorization = req.headers['authorization'],
		authorizationParts = null
	;

	if(!authorization) return res.sendStatus(401);
	else{

		authorizationParts = authorization.split(' ');

		if(authorizationParts.length >= 2){

			if(authorizationParts[0].toLowerCase() === 'bearer')
				accessToken = authorizationParts[1];
			else return res.sendStatus(401);
		}
	}

    jwt.verify(accessToken, JWT_SECRET, function(err, decoded){

		if(err) return res.sendStatus(401);

		req.decoded = decoded;
		next();
	});
};

//
// Creates a new JWT
exports.createJWT = function(data){

    var accessToken = null;
	try{

		accessToken = jwt.sign(data, JWT_SECRET);
	}
	catch(e){

		//
	}
	finally{

		return accessToken;
	} 
};