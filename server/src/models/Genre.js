let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let GenreSchema = new Schema({
    name: {type: String},
});

module.exports = mongoose.model('Genre', GenreSchema);