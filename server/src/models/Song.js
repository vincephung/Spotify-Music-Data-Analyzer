let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SongSchema = new Schema({
    id: {type: String},
    name: {type: String},
    image: {type: String},
    album: {type: Schema.Types.ObjectId, ref: "Album"},
    artists: [{type: Schema.Types.ObjectId, ref: 'Artist'}],
    genres: [{type: Schema.Types.ObjectId, ref:'Genre'}],
    spotifyUrl: {type: String},
});

module.exports = mongoose.model('Song', SongSchema);