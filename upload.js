'use strict';
let FilePdf = require('./models/Pdf');

module.exports = {

    PDF: function(req) {
        let pdf = req.files.pdf;
        pdf.mv('public' + req.url+ '/' + req.files.pdf.name, function (err) {
            if (err) {
                console.log('catch' + err);
                req.session.flash = {
                    type: 'fail',
                    message: 'Kunde inte spara filen.'
                };
                return false;
            }
        });

        let PdfSchema = new FilePdf({
            path: req.files.pdf.name,
            owner: req.session.user.username,
            type: req.url + '/'
        });

        PdfSchema.save()
            .then(function () {
                req.session.flash = {
                    type: 'success',
                    message: 'Du laddade precis upp ett dokument!'
                };
                console.log("Sparad i databasen!");
                return true;

            })
            .catch(function (err) {
                console.log('catch' + err);
                req.session.flash = {
                    type: 'fail',
                    message: 'Hallå! Du måste skriva något!'
                };
                return false;
            });
    }
};