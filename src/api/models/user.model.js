'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs')
;

//
// Create db schema for User object
var userSchema = new Schema({

    username: {type: String, trim: true, lowercase: true, unique: true, default: function(){

        return ( Date.now() + Math.random() ).toString().replace(/\./, '_');
    }},
    email: {type: String, trim: true, lowercase: true, required: true, unique: true},
    password: {type: String, required: true},
    name: {

        first: {type: String, trim: true, lowercase: true},
        last: {type: String, trim: true, lowercase: true}
    },
    gender: {type: String, enum: ['male', 'female'], trim: true, lowercase: true},
    role: {type: String, enum: ['user', 'admin'], trim: true, lowercase: true, default: 'user'},
    activeStatus: {type: String, enum: ['active', 'inactive', 'blocked', 'reported'], trim: true, lowercase: true, default: 'active'},
    updatedAt: {type: Date, default: Date.now},
    createdAt: {type: Date, default: Date.now}
});

//
// Hooks
userSchema.pre('save', function(next){

    var user = this;
    bcrypt.hash(user.password, null, null, function(err, hash){

        if(err) return next(err);

        user.password = hash;
        next();
    });
});

//
// Schema method to campare password.
userSchema.methods.comparePassword = function(password){

	var user = this;
	return bcrypt.compareSync(password, user.password);
};

//
// Schema method to filter out specified properties from doc.
userSchema.methods.getFilteredDoc = function(propsToFilter){

    var doc = this._doc;

    if(propsToFilter.constructor.toString().indexOf('Array') == -1) return doc;

    propsToFilter.forEach(function(prop){

        delete doc[prop];
    });

    return doc;
};

//
// Register and export user model
module.exports = mongoose.model('User', userSchema);