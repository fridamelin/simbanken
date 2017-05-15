let mongoose = require('mongoose');

let ActivitySchema = new mongoose.Schema({
    exercise: {type: String, required: true},
    //description: {type: String, required: true},
    explanation: {type: String, required: true},
    distance: {type: String, required: true},
    rest: {type: Number, required: true},
    help: {type: String, required: true},
    total: {type: Number, required: true},
    //stroke: {type: String, required: true},
    passID: {type: Number, required: true},
});
ActivitySchema.path('exercise').validate(function (text) {
    return text.length >=3;
});
let Snippet = mongoose.model('Activity', ActivitySchema);
module.exports = Snippet;

