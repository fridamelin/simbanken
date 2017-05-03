let router = require('express').Router();
let User = require('../models/User');
let bcrypt = require('bcrypt-nodejs');
let Activity = require('../models/activity');
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

            let html = "<table>";

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

                html += "<tr>";

                html += "<td>" + req.body.exercise[i] + "</td>"
                html += "<td>" + req.body.description[i] + "</td>"
                html += "<td>" + req.body.distance[i] + "</td>"
                html += "<td>" + req.body.rest[i] + "</td>"
                html += "<td>" + req.body.help[i] + "</td>"
                html += "<td>" + req.body.total[i] + "</td>"

                html += "</tr>";

                newActivity.save()
                    .then(function () {
                        console.log("saved in database!");
                        // res.redirect('/create');
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

            //Ett sätt
        // conversation({html: html}, function (err, pdf) {
        //     console.log(pdf.logs);
        //     pdf.stream.pipe(res)
        // });

            //Ett sätt
        // pdfDoc.create(html, {format: "Letter"}).toFile('/pass_' + passID + '.pdf', function (err, res) {
        //     if (err) return console.log(err);
        //     console.log(res);
        // });

            //Ett sätt
        //     jsreport.render(html).then(function(out) {
        //         out.stream.pipe(res);
        //     }).catch(function(e) {
        //         res.end(e.message);
        //     });

            //Ett sätt
        // let myDoc = new PdfDoc;
        //
        //     myDoc.pipe(fs.createWriteStream('node.pdf'));
        //
        //     myDoc.font('Times-Roman')
        //         .fontSize(20);
        //     .text('Testar lite', 100, 100);
        //     myDoc.end();

            res.redirect('/create');
        });
    });
router.route('/butterfly')
    .get(function (req, res) {
        if(req.session.user) {
            Activity.find({stroke: "butterfly"}, function (error, data) {
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
        }else {
            res.render('error/403');
        }
    });
router.route('/backstroke')
    .get(function (req, res) {
        if(req.session.user) {
            Activity.find({stroke: "backstroke"}, function (error, data) {
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
        }else {
            res.render('error/403');
        }
    });
router.route('/breaststroke')
    .get(function (req, res) {
        if(req.session.user) {
            Activity.find({stroke: "breaststroke"}, function (error, data) {
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
        }else {
            res.render('error/403');
        }
    });
router.route('/crawl')
    .get(function (req, res) {
        if(req.session.user) {
            Activity.find({stroke: "crawl"}, function (error, data) {
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
        }else {
            res.render('error/403');
        }
    });
router.route('/mixed')
    .get(function (req, res) {
        if(req.session.user) {
            Activity.find({stroke: "mixed"}, function (error, data) {
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
                res.render('home/mixed', {data: test});
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