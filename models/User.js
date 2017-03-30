'use strict';

/**
 * Create the login for the user
 */

let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

//The username should be unique, and both username and password is mandatory
let userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});
userSchema.path('password').validate(function (password) {
    return password.length >=6;
});
userSchema.path('username').validate(function (username) {
    return username.length >=4;
});
//Token from the lecture
userSchema.pre('save', function (next) {
    let user = this;
    bcrypt.genSalt(10, function (err, salt) {
        if(err){
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if(err){
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});
let User = mongoose.model('create', userSchema);
module.exports = User;
