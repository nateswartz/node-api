const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PersonSchema = new Schema({
    name: String,
    height: Number,
    mass: Number,
    hair_color: String,
    skin_color: String,
    eye_color: String,
    birth_year: String,
    gender: String,
});

const PersonModel = mongoose.model('Person', PersonSchema);

module.exports = PersonModel;
