let router = require('express').Router();
let User = require('../models/User');
let bcrypt = require('bcrypt-nodejs');


router.route('/')
    .get(function (req, res) {
        res.render('home/index');
    });
router.route('/createMembership')
    .get(function (req, res) {
        res.render('home/createMembership');
    })
    .post(function (req, res) {
        let newCreate = new User ({
            username: req.body.username,
            password: req.body.password
        });

    User.findOne({username: req.body.username}).then(function (data) {
    if (data) {
        req.session.flash = {
            type: 'fail',
            message: 'This username already exist, please try again!'
        };
        res.redirect('/createMembership');
    }
    else {
        newCreate.save()
            .then(function () {
                res.redirect('/');
            }).catch(function (data) {
            if (data) {
                req.session.flash = {
                    type: 'fail',
                    message: 'The username must be at least 4 characters,' +
                    'and the password 6 characters!'
                };

                res.redirect('/createMembership');
            }
        });
    }
});
    });

router.route('/strokes')
    .get(function (req, res) {
        res.render('home/strokes');
    });
//Get the loginpage
router.route('/login')
    .get(function (req, res) {
        User.find({}, function (error, data) {
            let context = {
                users: data.map(function (data) {
                    return {
                        username: data.username,
                        password: data.password
                    };
                })
            };
            res.render('home/login', context);
        });
    })
    .post(function (req, res) {
        console.log(req.body);
        let query = User.find({username: req.body.username});
        query.exec().then(function (data) {
            console.log(data);
            if(data.length > 0) {
                bcrypt.compare(req.body.password, data[0].password, function (error, result) {
                    if(error){
                        console.log(error);
                    }
                     if (result) {
                        req.session.user = data[0];
                        res.locals.user = req.session.user;
                        res.redirect('/strokes');
                    }
                });
            }
            else {
                req.session.flash = {
                    type: 'fail',
                    message: 'Wrong username or password, please try again!'
                };
                res.redirect('/login');
            }
        }).catch(function (err) {
            // Show the error
            console.log("error: " + err);
            res.redirect('/login');
        });
    });
//Get the logout page
router.route('/logout')
    .get(function (req, res) {
        res.locals.user = undefined;
        res.render('home/logout');
        req.session.destroy();
    })
    .post(function (req, res) {
        res.redirect('/logout');
    });
module.exports = router;