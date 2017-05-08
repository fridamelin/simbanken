let mongoose = require('mongoose');

let DescriptionSchema = new mongoose.Schema ({
    passID: {type: String},
    description: {type: String}
});

let Description =  mongoose.model('Description', DescriptionSchema);
module.exports = Description;