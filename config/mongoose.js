'use strict';

module.exports = function () {
    let mongoose = require('mongoose');
    const connectLink = 'mongodb://frida:frida@ds145370.mlab.com:45370/fridasdatabas';

    let db = mongoose.connect(connectLink);

    db.connection.on('connected', function () {
        console.log('connected');
        });

    db.connection.on('error', function (err) {
        console.log('error' + err);
    });

    db.connection.on('disconnected', function () {
        console.log('disconnected');
    });

    process.on('SIGNIT', function () {
        db.connection.close(function () {
            console.log('gone');
            process.exit(0);
        });
    });
    return db;
};