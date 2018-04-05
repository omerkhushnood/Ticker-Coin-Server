'use strict';

var express = require('express'),
    router = express.Router(),
    authCtrl = require('../controllers/auth.ctrl'),
    userCtrl = require('../controllers/user.ctrl')
;

//
// Register routes with no params.
router.route('/')
    .post(userCtrl.create_new_user)
;

//
// Login user
router.route('/login')
    .post(userCtrl.login_user)
;

// Authenticate following routes.
router.use(authCtrl.authenticate);

//
// me route.
router.route('/me')
    .get(userCtrl.read_self)
    .put(userCtrl.update_self)
;

//
// Export the router instance.
module.exports = router;