let router = require('express').Router();
let User = require('../models/User');
let bcrypt = require('bcrypt-nodejs');
let Activity = require('../models/activity');
let Description = require('../models/description');
let FilePdf = require('../models/Pdf');
let upload = require('../upload');
let pdfDoc = require('html-pdf');
let fs = require('fs');


router.route('/')
    .get(function (req, res) {
        res.render('home/index');
    });
router.route('/createMembership')
    .get(function (req, res) {
        res.render('home/createMembership');
    });

//Kommer det till en ny tränare eller nya styrelsemedlemmar kan man ta bort kommentarerna och använda koden då den fungerar som den ska.

//     .get(function (req, res) {
//         res.render('home/createMembership');
//     })
//     .post(function (req, res) {
//         let newCreate = new User({
//             username: req.body.username,
//             password: req.body.password
//         });
//
//         User.findOne({username: req.body.username}).then(function (data) {
//             if (data) {
//                 req.session.flash = {
//                     type: 'fail',
//                     message: 'Användarnamnet är upptaget, vänligen välj ett annat!'
//                 };
//                 res.redirect('/createMembership');
//             }
//             else {
//                 newCreate.save()
//                     .then(function () {
//                         res.redirect('/');
//                     }).catch(function (data) {
//                     if (data) {
//                         req.session.flash = {
//                             type: 'fail',
//                             message: 'Användarnamnet måste vara minst 4 tecken,' +
//                             'och lösenordet 6 tecken!'
//                         };
//
//                         res.redirect('/createMembership');
//                     }
//                 });
//             }
//         });
//     });
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
        } else {
            res.render('error/403');
        }
    });
//Hämta inloggssidan
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

//Hämta de passen som den inloggade har skapat
router.route('/my_profile')
    .get(function (req, res) {
        if (req.session.user) {
            FilePdf.find({
                owner: req.session.user.username,
                type: {'$nin': ['/board_protokoll/', '/protokoll/', '/teknik/', '/kunskapsstege/', '/dokument/']}
            }, function (error, data) {
                console.log(req.body.stroke);
                if (error) {
                    console.log(error);
                }
                //Kolla vilken typ av simsätt det är och anpassa bilden efter det.
                for (let i = 0; i < data.length; i++) {
                    if (data[i].type === "/butterfly/") {
                        data[i].image = "/butterfly.jpg";
                    } else if (data[i].type === "/backstroke/") {
                        data[i].image = "/backstroke.jpg";
                    } else if (data[i].type === "/breaststroke/") {
                        data[i].image = "/breaststroke.jpg";
                    } else if (data[i].type === "/crawl/") {
                        data[i].image = "/crawl.jpg";
                    } else if (data[i].type === "/mixed/") {
                        data[i].image = "/mixednew.jpg";
                    }
                }
                res.render('home/my_profile', {pdf: data});
                //});
            });
        } else {
            res.render('error/403');
        }
    });
//Hämta skapa-pass sidan
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
        Activity.findOne().sort({passID: -1}).exec((err, item) => {
            let passID;
            console.log(item);
            if (item === null) {
                passID = 0;
            } else {
                passID = item.passID + 1;
            }

            let stroke = req.body.stroke === "" ? null : req.body.stroke;
            let nrOfActivities = req.body.exercise.length;

            let html = "<table style='border:1px solid black; background-color:#85bffc; width:100%;'>";

            //Skapa en tabell med inputens värden
            html += "<th >" + 'Övning' + "</th>"
            html += "<th>" + 'Förklaring' + "</th>"
            html += "<th>" + 'Distans' + "</th>"
            html += "<th>" + 'Vila' + "</th>"
            html += "<th>" + 'Hjälpmedel' + "</th>"
            html += "<th>" + 'Totalt' + "</th>"

            for (let i = 0; i < nrOfActivities; i++) {
                let newActivity = new Activity({
                    exercise: req.body.exercise[i],
                    explanation: req.body.description[i],
                    distance: req.body.distance[i],
                    rest: req.body.rest[i],
                    help: req.body.help[i],
                    total: req.body.total[i],
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
                    .catch(function (err, req) {
                        console.log('catch' + err);
                        req.session.flash = {
                            type: 'fail',
                            message: 'Hallå! Du måste skriva någonting!'
                        };

                        return res.redirect('/create');
                    });
            }

            html += "</table>";

            //Spara passet som PDF
            pdfDoc.create(html,
                {
                    "format": "Letter ",
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
                .toFile('./public/' + stroke + '/pass_' + passID + '.pdf', function (err, res) {
                    if (err) return console.log(err);

                    let pdf = new FilePdf({
                        path: 'pass_' + passID + '.pdf',
                        owner: req.session.user.username,
                        type: '/' + stroke + '/',
                        description: req.body.beskrivning,
                    });
                    pdf.save(function (err) {
                        if (err) return console.log(err);
                        console.log("saved pdf to database!");
                    });
                });

            res.redirect('/create');
        });
    });
//Hämta fjärilssidan
router.route('/butterfly')
    .get(function (req, res) {
        if (req.session.user) {
            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                //Hitta beskrivningen till de passen som finns i ryggsim
                Description.find({}, function (err, descriptions) {
                    for (let i = 0; i < descriptions.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if ("pass_" + descriptions[i].passID + ".pdf" === data[j].path) {
                                data[j].description = descriptions[i];
                            }
                        }
                    }

                    res.render('home/butterfly', {pdf: data});
                });
            });
        } else {
            res.render('error/403');
        }
    });
//Hämta ryggsimssidan
router.route('/backstroke')
    .get(function (req, res) {
        if (req.session.user) {
            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                //Hitta beskrivningen till de passen som finns i ryggsim
                Description.find({}, function (err, descriptions) {
                    for (let i = 0; i < descriptions.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if ("pass_" + descriptions[i].passID + ".pdf" === data[j].path) {
                                data[j].description = descriptions[i];
                            }
                        }
                    }
                    res.render('home/backstroke', {pdf: data});
                });
            });
        } else {
            res.render('error/403');
        }
    });
//Hämta bröstsimssidan
router.route('/breaststroke')
    .get(function (req, res) {
        if (req.session.user) {
            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                //Hitta beskrivningen till de passen som finns i bröstsim
                Description.find({}, function (err, descriptions) {
                    for (let i = 0; i < descriptions.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if ("pass_" + descriptions[i].passID + ".pdf" === data[j].path) {
                                data[j].description = descriptions[i];
                            }
                        }
                    }
                    res.render('home/breaststroke', {pdf: data});
                });
            });
        } else {
            res.render('error/403');
        }

    });
//Hämta frisimssidan
router.route('/crawl')
    .get(function (req, res) {
        if (req.session.user) {
            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                //Hitta beskrivningen till de passen som finns i frisim
                Description.find({}, function (err, descriptions) {
                    for (let i = 0; i < descriptions.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if ("pass_" + descriptions[i].passID + ".pdf" === data[j].path) {
                                data[j].description = descriptions[i];
                            }
                        }
                    }
                    res.render('home/crawl', {pdf: data});
                });
            });
        } else {
            res.render('error/403');
        }
    });
//Hämta blandat-sidan
router.route('/mixed')
    .get(function (req, res) {
        if (req.session.user) {
            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                //Hitta beskrivningen till de passen som finns i blandat
                Description.find({}, function (err, descriptions) {
                    for (let i = 0; i < descriptions.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if ("pass_" + descriptions[i].passID + ".pdf" === data[j].path) {
                                data[j].description = descriptions[i];
                            }
                        }
                    }
                    res.render('home/mixed', {pdf: data});
                });
            });
        } else {
            res.render('error/403');
        }
    });
//Hämta tekniksidan
router.route('/teknik')
    .get(function (req, res) {
        if (req.session.user) {
            console.log(req.url);

            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                console.log(data);
                res.render('home/teknik', {pdf: data});
            });
        } else {
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
        if (req.session.user) {
            res.render('home/document');
        } else {
            res.render('error/403');
        }
    });
//Hämta kunskapsstegesidan
router.route('/kunskapsstege')
    .get(function (req, res) {
        if (req.session.user) {
            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                console.log(data);
                res.render('home/kunskapsstege', {pdf: data});
            });
        } else {
            res.render('error/403');
        }
    })
    .post(function (req, res) {
        if (!req.files)
            return res.status(400).send('Ingen fil blev uppladdad.');

        let sparad = upload.PDF(req);
        res.redirect('/kunskapsstege');
    });
//Hämta utbildningssidan
router.route('/utbildning')
    .get(function (req, res) {
        if (req.session.user) {
            res.render('home/utbildning');
        } else {
            res.render('error/403');
        }
    });
//Hämta dokumentsidan
router.route('/dokument')
    .get(function (req, res) {
        if (req.session.user) {
            console.log(req.url);

            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                console.log(data);
                console.log('hejsan');
                res.render('home/dokument', {pdf: data});
            });
        } else {
            res.render('error/403');
        }
    })
    .post(function (req, res) {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        let sparad = upload.PDF(req);
        res.redirect('/dokument');
    });
//Hämta protokoll
router.route('/map_protokoll')
    .get(function (req, res) {
        if (req.session.user) {
            res.render('home/map_protokoll');
        } else {
            res.render('error/403');
        }
    });
//Hämta protokoll - styrelse
router.route('/board_protokoll')
    .get(function (req, res) {
        if (req.session.user) {
            console.log(req.url);

            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                console.log(data);
                res.render('home/board_protokoll', {pdf: data});
            });
        } else {
            res.render('error/403');
        }
    })
    .post(function (req, res) {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        let sparad = upload.PDF(req);
        res.redirect('/board_protokoll');
    });
//Hämta protokoll - tränare
router.route('/protokoll')
    .get(function (req, res) {
        if (req.session.user) {
            console.log(req.url);

            FilePdf.find({type: req.url}, function (error, data) {
                if (error) {
                    console.log(error);
                }
                console.log(data);
                res.render('home/protokoll', {pdf: data});
            });
        } else {
            res.render('error/403');
        }
    })
    .post(function (req, res) {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        let sparad = upload.PDF(req);

        res.redirect('/protokoll');
    });
//Hämta tabort-sidan
router.route('/delete/:id')
    .get(function (req, res) {
        if (req.session.user) {
            res.render('home/delete', {id: req.params.id});
        } else {
            res.redirect('/403');
        }
    })
    //Hitta rätt pass för att ta bort
    .post(function (req, res) {
        if (req.session.user) {
            FilePdf.findOneAndRemove({_id: req.params.id}, function (error) {
                if (error) {
                    throw new Error('Något gick snett..');
                }
                req.session.flash = {
                    type: 'success',
                    message: 'Passet togs bort!'
                };
                res.redirect('/my_profile');
            });
        } else {
            res.redirect('/403');
        }
    });

//Hämta logga ut-sidan
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