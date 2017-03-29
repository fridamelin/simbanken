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

//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/home'));

app.listen(port, function () {
    console.log('heey it works on port:' + port);
});