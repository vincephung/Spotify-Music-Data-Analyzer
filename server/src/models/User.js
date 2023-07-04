let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {type:String},
    email: {type:String},
    country: {type:String},
    albums: [{type: Schema.Types.ObjectId, ref: "Album"}],
    songs: [{type: Schema.Types.ObjectId, ref: 'Song'}],
    artists: [{type: Schema.Types.ObjectId, ref: 'Artist'}],
    genres: [{type: Schema.Types.ObjectId, ref:'Genre'}],
    spotifyPremium: {type: Boolean, default: false},
    isPremium: {type: Boolean, default: false},
    generatedShareLink: {type:String, default:null}
});

module.exports = mongoose.model('User', userSchema)