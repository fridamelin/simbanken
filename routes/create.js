// module.exports = function (io) {
//
//     let router = require('express').Router();
//     let User = require('../models/User');
//     let bcrypt = require('bcrypt-nodejs');
//     let Activity = require('../models/activity');
//     let Description = require('../models/description');
//     let FilePdf = require('../models/Pdf');
//     let upload = require('../upload');
//     let pdfDoc = require('html-pdf');
//     let fs = require('fs');
//     let jsreport = require('jsreport');
//
//
//
//
//     router.route('/create')
//         .get(function (req, res) {
//             if (req.session.user) {
//                 res.render('home/create');
//             } else {
//                 res.redirect('/403');
//             }
//         })
//         .post(function (req, res) {
//             console.log(req.body);
//             Activity.findOne().sort('-passID').exec((err, item) => {
//                 let passID = Number.parseInt(item.passID) + 1;
//
//                 let stroke = req.body.stroke === "" ? null : req.body.stroke;
//
//                 let nrOfActivities = req.body.exercise.length;
//
//
//                 let html = "<table style='border:1px solid black; background-color:#85bffc; width:100%;'>";
//
//
//                 html += "<th >" + 'Övning' + "</th>"
//                 html += "<th>" + 'Förklaring' + "</th>"
//                 html += "<th>" + 'Distans' + "</th>"
//                 html += "<th>" + 'Vila' + "</th>"
//                 html += "<th>" + 'Hjälpmedel' + "</th>"
//                 html += "<th>" + 'Totalt' + "</th>"
//
//
//                 for (let i = 0; i < nrOfActivities; i++) {
//                     let newActivity = new Activity({
//                         exercise: req.body.exercise[i],
//                         description: req.body.description[i],
//                         distance: req.body.distance[i],
//                         rest: req.body.rest[i],
//                         help: req.body.help[i],
//                         total: req.body.total[i],
//                         stroke: stroke,
//                         passID: passID,
//                         username: req.body.username
//                     });
//
//                     html += "<tr>";
//
//                     html += "<td style='border:1px solid black; text-align:center;background-color:white;'>" + req.body.exercise[i] + "</td>"
//                     html += "<td style='border:1px solid black; text-align:center;background-color:white;'>" + req.body.description[i] + "</td>"
//                     html += "<td style='border:1px solid black; text-align:center;background-color:white;'>" + req.body.distance[i] + "</td>"
//                     html += "<td style='border:1px solid black; text-align:center;background-color:white;'>" + req.body.rest[i] + "</td>"
//                     html += "<td style='border:1px solid black; text-align:center;background-color:white;'>" + req.body.help[i] + "</td>"
//                     html += "<td style='border:1px solid black; text-align:center;background-color:white;'>" + req.body.total[i] + "</td>"
//
//                     html += "</tr>";
//
//                     newActivity.save()
//                         .then(function () {
//                             console.log("saved in database!");
//
//
//                         })
//                         .catch(function (err) {
//                             console.log('catch' + err);
//                             req.session.flash = {
//                                 type: 'fail',
//                                 message: 'Hallå! Du måste skriva någonting!'
//                             };
//                             res.redirect('/login');
//                         });
//                 }
//
//                 html += "</table>";
//
//                 console.log(html);
//
//                 //Spara passet som PDF
//                 pdfDoc.create(html,
//                     {
//                         "format": "Letter ",
//                         "orientation": "landscape",
//                         "border": {
//                             "top": "2px",
//                             "right": "1px",
//                             "bottom": "2px",
//                             "left": "1.5px"
//                         },
//                         "header": {
//                             "height": "30mm",
//                             "contents": "<div style=text-align:center;>" + req.body.beskrivning + "</div>"
//                         },
//                     })
//                     .toFile('./public/' + stroke + '/pass_' + passID + '.pdf', function (err, res) {
//                         if (err) return console.log(err);
//                         console.log(res);
//
//                         let pdf = new FilePdf({
//                             path: 'pass_' + passID + '.pdf',
//                             owner: req.session.user.username,
//                             type: '/' + stroke + '/'
//                         });
//                         pdf.save(function (err) {
//                             if (err) return console.log(err);
//                             console.log("saved pdf to database!");
//                         });
//                     });
//                 let description = new Description({
//                     passID: passID,
//                     description: req.body.beskrivning
//                 });
//                 description.save(function (err) {
//                     if (err) return console.log(err);
//                     console.log("beskrivning saved!");
//                 });
//
//                 let notis = {
//                     User: req.session.user
//                 };
//                 io.emit('Notification',{notification: notis});
//
//                 res.redirect('/create');
//             });
//         });
//     return router;
// };