let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ArtistSchema = new Schema({
    id: {type:String},
    spotifyUrl: {type:String},
    name: {type:String},
    image: {type:String},
});

module.exports = mongoose.model('Artist', ArtistSchema);
