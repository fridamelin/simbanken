let mongoose = require('mongoose');

let PdfSchema = new mongoose.Schema ({
    path: {type: String},
    owner: {type: String},
    type: {type: String},
   // created_at: {type: Date, default: Date.now()},
    description: {type: String},
});

let PDF =  mongoose.model('Pdf', PdfSchema);
module.exports = PDF;