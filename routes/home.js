let router = require('express').Router();
let User = require('../models/User');


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
//gGet the loginpage
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
        })
    });
module.exports = router;