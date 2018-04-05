'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    authCtrl = require('./auth.ctrl')
;

//
// Create new user.
exports.create_new_user = function(req, res, next){

    var newUserData = req.body;

    delete newUserData.role;
    delete newUserData.activeStatus;
    delete newUserData.updatedAt;
    delete newUserData.createdAt;

    var newUser = new User(newUserData);

    newUser.save(function(err, createdUser){

        if(err) return res.sendStatus(500);

        var createdUserDoc = createdUser._doc;
        delete createdUserDoc.password;

        res.status(201).json(createdUser);
    });
};

//
// Login user.
exports.login_user = function(req, res, next){

    var email = req.body.email;
    var password = req.body.password;

    User.findOne({$or: [{username: email}, {email: email}]})
        .exec(function(err, user){

            if(err) return res.sendStatus(500);
            if(!user) return res.sendStatus(401);

            if(!user.comparePassword(password)) return res.sendStatus(401);

            var userDoc = user.getFilteredDoc(['password']);

            var accessToken = authCtrl.createJWT(userDoc);
            if(!accessToken) return res.sendStatus(500);

            res.json({

                access_token: accessToken,
                user: userDoc
            });
        })
    ;
};

//
// Read self.
exports.read_self = function(req, res, next){

    res.json(req.decoded);
};

//
// Update self.
exports.update_self = function(req, res, next){

    //
};