let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AlbumSchema = new Schema({
    id: {type: String},
    name: {type: String}, 
    image: {type: String},
    artists: [{type: Schema.Types.ObjectId, ref: 'Artist'}],
    spotifyUrl: {type: String},
});

module.exports = mongoose.model('Album', AlbumSchema);