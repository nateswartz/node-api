const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PokemonSchema = new Schema({
    id: Number,
    name: String,
    base_experience: Number,
    height: Number,
    is_default: Boolean,
    skin_color: String,
    eye_color: String,
    birth_year: String,
    gender: String,
});

const PokemonModel = mongoose.model('Pokemon', PokemonSchema);

module.exports = PokemonModel;
