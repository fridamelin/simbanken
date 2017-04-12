let mongoose = require('mongoose');

let PdfSchema = new mongoose.Schema ({
    path: {type: String},
    owner: {type: String}
});

let PDF =  mongoose.model('Pdf', PdfSchema);
module.exports = PDF;