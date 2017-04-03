'use strict';

let express = require('express');
let session = require('express-session');
let exhbs = require('express-handlebars');
let path = require('path');
let bodyParser = require('body-parser');
let mongoose = require('./config/mongoose');

let app = express();
let port = process.env.PORT || 8000;

mongoose();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.engine('.hbs', exhbs({
    defaultLayout: 'default',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//session, took from a lecture
app.use(session({
    name:   "theserversession",  // Don't use default session cookie name.
    secret: "K7smsx9MsEasad89wEzVp5EeCep5s", // should be kept secret
    saveUninitialized: false, // save/not-save a created but not modified session
    resave: false, // resave even if a request is not changing the session
    cookie: {
        httpOnly: true, // dont allow client script messing with the cookie
        maxAge: 1000 * 60 * 60 * 24 // Millisecond
    }
}));


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/home'));

app.listen(port, function () {
    console.log('heey it works on port:' + port);
});