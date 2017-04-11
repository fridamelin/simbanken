let router = require('express').Router();
let User = require('../models/User');
let bcrypt = require('bcrypt-nodejs');
let Activity = require('../models/activity');

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
router.route('/403')
    .get(function (req, res) {
        res.render('error/403');
    })
    .post(function (req, res) {
        res.render('error/403');
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
                        res.redirect('/');
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
router.route('/create')
    .get(function (req, res) {
        res.render('home/create');
    })
    .post(function (req, res) {
        console.log(req.body);
        Activity.findOne().sort('-passID').exec((err, item) => {
            let passID = Number.parseInt(item.passID) + 1;

            let stroke = req.body.stroke === "" ? null : req.body.stroke;

            let nrOfActivities = req.body.exercise.length;

            for (let i = 0; i < nrOfActivities; i++) {
                let newActivity = new Activity({
                    exercise: req.body.exercise[i],
                    description: req.body.description[i],
                    distance: req.body.distance[i],
                    rest: req.body.rest[i],
                    help: req.body.help[i],
                    total: req.body.total[i],
                    stroke: stroke,
                    passID: passID
                });

                newActivity.save()
                    .then(function () {
                        console.log("saved in database!");
                        // res.redirect('/create');
                    })
                    .catch(function (err) {
                        console.log('catch' + err);
                        req.session.flash = {
                            type: 'fail',
                            message: 'Hey! You need to write something!'
                        };
                        res.redirect('/login');
                    });
            }
            res.redirect('/create');
        });
    });
router.route('/butterfly')
    .get(function (req,res) {
        Activity.find({stroke: "butterfly"}, function(error, data) {
            // console.log(data);

            let counter = 0;

            let test = [];
            test[counter] = [];
            test[counter].push(data[0]);

            for (let i = 1; i < data.length; i++) {
                if (data[i].passID !== test[counter][0].passID) {
                    counter++;
                    test[counter] = [];
                }
                test[counter].push(data[i]);
            }
            console.log(test);
            res.render('home/butterfly', {data: test});
        });
    });
router.route('/backstroke')
    .get(function (req, res) {
        Activity.find({stroke: "backstroke"}, function(error, data) {
            // console.log(data);

            let counter = 0;

            let test = [];
            test[counter] = [];
            test[counter].push(data[0]);

            for (let i = 1; i < data.length; i++) {
                if (data[i].passID !== test[counter][0].passID) {
                    counter++;
                    test[counter] = [];
                }
                test[counter].push(data[i]);
            }
            console.log(test);
            res.render('home/backstroke', {data: test});
        });
    });
router.route('/breaststroke')
    .get(function (req, res) {
        Activity.find({stroke: "breaststroke"}, function(error, data) {
            // console.log(data);

            let counter = 0;

            let test = [];
            test[counter] = [];
            test[counter].push(data[0]);

            for (let i = 1; i < data.length; i++) {
                if (data[i].passID !== test[counter][0].passID) {
                    counter++;
                    test[counter] = [];
                }

                test[counter].push(data[i]);
            }
            console.log(test);
            res.render('home/breaststroke', {data: test});
        });
    });
router.route('/crawl')
    .get(function (req, res) {
        Activity.find({stroke: "crawl"}, function(error, data) {
            // console.log(data);

            let counter = 0;

            let test = [];
            test[counter] = [];
            test[counter].push(data[0]);

            for (let i = 1; i < data.length; i++) {
                if (data[i].passID !== test[counter][0].passID) {
                    counter++;
                    test[counter] = [];
                }
                test[counter].push(data[i]);
            }
            console.log(test);
            res.render('home/crawl', {data: test});
        });
    });
router.route('/mixed')
    .get(function (req, res) {
        res.render('home/mixed');
    });
router.route('/teknik')
    .get(function (req, res) {
        res.render('home/teknik');
    });
router.route('/document')
    .get(function (req, res) {
        res.render('home/document');
    });
router.route('/kunskapsstege')
    .get (function (req, res) {
        res.render('home/kunskapsstege');
    });
router.route('/utbildning')
    .get (function (req, res) {
        res.render('home/utbildning');
    });
router.route('/protokoll')
    .get (function (req, res) {
        res.render('home/protokoll');
    })
    .post(function (req, res) {

    });
router.route('/utvardering')
    .get (function (req, res) {
        res.render('home/utvardering');
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