'use strict';
// Server 138.68.99.147

let express = require('express');
let session = require('express-session');
let exhbs = require('express-handlebars');
let path = require('path');
let bodyParser = require('body-parser');
let mongoose = require('./config/mongoose');
let fileUpload = require('express-fileupload');
let http = require('http');

let app = express();
app.use(fileUpload());
let port = process.env.PORT || 8000;

mongoose();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.engine('.hbs', exhbs({
    defaultLayout: 'default',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Session - tog från en föreläsningsslide
app.use(session({
    name:   "theserversession",
    secret: "K7smsx9MsEasad89wEzVp5EeCep5s",
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(function (req, res, next) {
    res.locals.flash = req.session.flash;

    delete req.session.flash;
    next();
});

app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/home'));

//404 hantering
app.use(function (req, res, next) {
    res.status(404).render('error/404');
});

//500 hantering
app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500).render('error/500');
});

app.listen(port, function () {
    console.log('heey it works on port:' + port);
});