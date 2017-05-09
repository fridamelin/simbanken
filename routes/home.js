let router = require('express').Router();
let User = require('../models/User');
let bcrypt = require('bcrypt-nodejs');
let Activity = require('../models/activity');
let Description = require('../models/description');
let FilePdf = require('../models/Pdf');
let upload = require('../upload');
let pdfDoc = require('html-pdf');
let fs = require('fs');
let jsreport = require('jsreport');


router.route('/')
    .get(function (req, res) {
        res.render('home/index');
    });
router.route('/createMembership')
    .get(function (req, res) {
        res.render('home/createMembership');
    })
    .post(function (req, res) {
        let newCreate = new User({
            username: req.body.username,
            password: req.body.password
        });

        User.findOne({username: req.body.username}).then(function (data) {
            if (data) {
                req.session.flash = {
                    type: 'fail',
                    message: 'Användarnamnet är upptaget, vänligen välj ett annat!'
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
                            message: 'Användarnamnet måste vara minst 4 tecken,' +
                            'och lösenordet 6 tecken!'
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
        if (req.session.user) {
            res.render('home/strokes');
        }else {
            res.render('error/403');
        }
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
        let query = User.find({'username': req.body.username});
        query.exec().then(function (data) {
            console.log(data);

                bcrypt.compare(req.body.password, data[0].password, function (error, result) {

                    if (result) {
                        req.session.user = data[0];
                        //res.locals.user = req.session.user;
                        res.redirect('/');
                    }
            else {
                req.session.flash = {
                    type: 'fail',
                    message: 'Fel användarnamn eller lösenord, försök igen!'
                };
                res.redirect('/login');
            }
                });
        }).catch(function (err) {
            // Show the error
            console.log("error: " + err);
            res.redirect('/login');
        });
    });
router.route('/my_profile')
    .get(function (req, res) {
        if (req.session.user){
                FilePdf.find({owner: req.session.user.username, type: {'$nin':['/board_protokoll/', '/protokoll/']}}, function (error, data) {
                    console.log(req.body.stroke);
                    if (error) {
                        console.log(error);
                    }
                    Description.find({}, function(err, descriptions) {
                        for (let i = 0; i < descriptions.length; i++) {
                            for (let j = 0; j < data.length; j++) {
                                if ("pass_" + descriptions[i].passID + ".pdf" === data[j].path) {
                                    // console.log("hej!: " + descriptions[i] + " : " + data[j].description);
                                    data[j].description = descriptions[i];
                                }
                            }
                        }
                        res.render('home/my_profile', {pdf: data});
                    });
                });
            }else {
                res.render('error/403');
            }
    });
router.route('/create')
    .get(function (req, res) {
        if (req.session.user) {
            res.render('home/create');
        } else {
            res.redirect('/403');
        }
    })
    .post(function (req, res) {
        console.log(req.body);
        Activity.findOne().sort('-passID').exec((err, item) => {
            let passID = Number.parseInt(item.passID) + 1;

            let stroke = req.body.stroke === "" ? null : req.body.stroke;

            let nrOfActivities = req.body.exercise.length;


            let html = "<table style='border:1px solid black; background-color:#85bffc; width:100%;'>";


            html += "<th >" + 'Övning' + "</th>"
            html += "<th>" + 'Förklaring' + "</th>"
            html += "<th>" + 'Distans' + "</th>"
            html += "<th>" + 'Vila' + "</th>"
            html += "<th>" + 'Hjälpmedel' + "</th>"
            html += "<th>" + 'Totalt' + "</th>"



            for (let i = 0; i < nrOfActivities; i++) {
                let newActivity = new Activity({
                    exercise: req.body.exercise[i],
                    description: req.body.description[i],
                    distance: req.body.distance[i],
                    rest: req.body.rest[i],
                    help: req.body.help[i],
                    total: req.body.total[i],
                    stroke: stroke,
                    passID: passID,
                    username: req.body.username
                });

                html += "<tr>";

                html += "<td style='border:1px solid black; text-align:center;background-color:white;'>" + req.body.exercise[i] + "</td>"
                html += "<td style='border:1px solid black; text-align:center;background-color:white;'>" + req.body.description[i] + "</td>"
                html += "<td style='border:1px solid black; text-align:center;background-color:white;'>" + req.body.distance[i] + "</td>"
                html += "<td style='border:1px solid black; text-align:center;background-color:white;'>" + req.body.rest[i] + "</td>"
                html += "<td style='border:1px solid black; text-align:center;background-color:white;'>" + req.body.help[i] + "</td>"
                html += "<td style='border:1px solid black; text-align:center;background-color:white;'>" + req.body.total[i] + "</td>"

                html += "</tr>";

                newActivity.save()
                    .then(function () {
                        console.log("saved in database!");


                    })
                    .catch(function (err) {
                        console.log('catch' + err);
                        req.session.flash = {
                            type: 'fail',
                            message: 'Hallå! Du måste skriva någonting!'
                        };
                        res.redirect('/login');
                    });
            }

            html += "</table>";

            console.log(html);

            //Spara passet som PDF
        pdfDoc.create(html,
            {"format": "Letter ",
                "orientation": "landscape",
            "border": {
                "top": "2px",
                "right": "1px",
                "bottom": "2px",
                "left": "1.5px"
            },
            "header": {
                "height": "30mm",
                "contents": "<div style=text-align:center;>" + req.body.beskrivning + "</div>"
            },
            })
            .toFile('./public/' + stroke  + '/pass_' + passID + '.pdf', function (err, res) {
            if (err) return console.log(err);
            console.log(res);

            let pdf = new FilePdf({
                path: 'pass_' + passID + '.pdf',
                owner: req.session.user.username,
                type: '/' + stroke + '/'
            });
            pdf.save(function(err) {
                if (err) return console.log(err);
                console.log("saved pdf to database!");
            });
        });
            let description = new Description({
                passID: passID,
                description: req.body.beskrivning,
            });
            description.save(function(err) {
                if (err) return console.log(err);
                console.log("beskrivning saved!");
            });
            res.redirect('/create');
        });
    });
router.route('/butterfly')
    .get(function (req, res) {
            if(req.session.user) {
                FilePdf.find({type: req.url}, function (error, data) {
                    if (error) {
                        console.log(error);
                    }
                    Description.find({}, function(err, descriptions) {
                        for (let i = 0; i < descriptions.length; i++) {
                            for (let j = 0; j < data.length; j++) {
                                if ("pass_" + descriptions[i].passID + ".pdf" === data[j].path) {
                                   // console.log("hej!: " + descriptions[i] + " : " + data[j].description);
                                    data[j].description = descriptions[i];
                                }
                            }
                        }
                        res.render('home/butterfly', {pdf: data});
                    });
                });
            }else {
                res.render('error/403');
            }
    });
router.route('/backstroke')
    .get(function (req, res) {
            if(req.session.user) {
                FilePdf.find({type: req.url}, function (error, data) {
                    if (error) {
                        console.log(error);
                    }
                    Description.find({}, function(err, descriptions) {
                        for (let i = 0; i < descriptions.length; i++) {
                            for (let j = 0; j < data.length; j++) {
                                if ("pass_" + descriptions[i].passID + ".pdf" === data[j].path) {
                                    // console.log("hej!: " + descriptions[i] + " : " + data[j].description);
                                    data[j].description = descriptions[i];
                                }
                            }
                        }
                        res.render('home/backstroke', {pdf: data});
                    });
                });
            }else {
                res.render('error/403');
            }
    });
router.route('/breaststroke')
    .get(function (req, res) {
        if(req.session.user) {
            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                Description.find({}, function(err, descriptions) {
                    for (let i = 0; i < descriptions.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if ("pass_" + descriptions[i].passID + ".pdf" === data[j].path) {
                               // console.log("hej!: " + descriptions[i] + " : " + data[j].description);
                                data[j].description = descriptions[i];
                            }
                        }
                    }
                    res.render('home/breaststroke', {pdf: data});
                });
            });
        }else {
            res.render('error/403');
        }

    });
router.route('/crawl')
    .get(function (req, res) {
        if(req.session.user) {
            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                Description.find({}, function(err, descriptions) {
                    for (let i = 0; i < descriptions.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if ("pass_" + descriptions[i].passID + ".pdf" === data[j].path) {
                               // console.log("hej!: " + descriptions[i] + " : " + data[j].description);
                                data[j].description = descriptions[i];
                            }
                        }
                    }
                    res.render('home/crawl', {pdf: data});
                });
            });
        }else {
            res.render('error/403');
        }
    });
router.route('/mixed')
    .get(function (req, res) {
        if(req.session.user) {
            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                Description.find({}, function(err, descriptions) {
                    for (let i = 0; i < descriptions.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if ("pass_" + descriptions[i].passID + ".pdf" === data[j].path) {
                               // console.log("hej!: " + descriptions[i] + " : " + data[j].description);
                                data[j].description = descriptions[i];
                            }
                        }
                    }
                    res.render('home/mixed', {pdf: data});
                });
            });
        }else {
            res.render('error/403');
        }

    });
router.route('/teknik')
    .get(function (req, res) {
        if(req.session.user) {
            console.log(req.url);

            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                console.log(data);
                res.render('home/teknik', {pdf: data});
            });
        }else {
            res.render('error/403');
        }
    })
    .post(function (req, res) {
        if (!req.files)
            return res.status(400).send('Ingen fil blev uppladdad.');

        let sparad = upload.PDF(req);
        res.redirect('/teknik');
    });
router.route('/document')
    .get(function (req, res) {
        if(req.session.user) {
            res.render('home/document');
        }else{
            res.render('error/403');
        }
    });
router.route('/kunskapsstege')
    .get(function (req, res) {
        if(req.session.user) {
            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                console.log(data);
                res.render('home/kunskapsstege', {pdf: data});
            });
        }else {
            res.render('error/403');
        }
    })
    .post(function (req, res) {
        if (!req.files)
            return res.status(400).send('Ingen fil blev uppladdad.');

        let sparad = upload.PDF(req);
        res.redirect('/kunskapsstege');
    });
router.route('/utbildning')
    .get(function (req, res) {
        if(req.session.user) {
            res.render('home/utbildning');
        }else{
            res.render('error/403');
        }
    });
router.route('/dokument')
    .get(function (req, res) {
        if(req.session.user) {
            console.log(req.url);

            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                console.log(data);
                console.log('hejsan');
                res.render('home/dokument', {pdf: data});
            });
        }else{
            res.render('error/403');
        }
    })
             .post(function (req, res) {
                 if (!req.files)
                     return res.status(400).send('No files were uploaded.');

                 let sparad = upload.PDF(req);
                 res.redirect('/dokument');
             });
router.route('/map_protokoll')
    .get(function (req, res) {
        if(req.session.user) {
            res.render('home/map_protokoll');
        }else {
            res.render('error/403');
        }
    });
router.route('/board_protokoll')
    .get(function (req, res) {
        if(req.session.user) {
            console.log(req.url);

            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                console.log(data);
                res.render('home/board_protokoll', {pdf: data});
            });
        }else {
            res.render('error/403');
        }
    })
    .post(function (req, res) {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        let sparad = upload.PDF(req);
        res.redirect('/board_protokoll');
    });
router.route('/protokoll')
    .get(function (req, res) {
        if(req.session.user) {
            console.log(req.url);

            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                console.log(data);
                res.render('home/protokoll', {pdf: data});
            });
        }else {
            res.render('error/403');
        }
    })
    .post(function (req, res) {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        let sparad = upload.PDF(req);

            res.redirect('/protokoll');
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