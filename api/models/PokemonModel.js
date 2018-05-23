const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PokemonSchema = new Schema({
    id: Number,
    name: String,
    base_experience: Number,
    height: Number,
    is_default: Boolean,
    order: Number,
    weight: Number,
    abilities: [{
        slot: Number,
        is_hidden: Boolean,
        ability: {
            url: String,
            name: String,
        },
    }],
    stats: [{
        stat: {
            url: String,
            name: String,
        },
        effort: Number,
        base_stat: Number,
    }],
    species: {
        url: String,
        name: String,
    },
    types: [{
        slot: Number,
         type: {type: {
                url: String,
                name: String,
               },
         },
    }],
    sprites: {
        back_female: String,
        back_shiny_female: String,
        back_default: String,
        front_female: String,
        front_shiny_female: String,
        back_shiny: String,
        front_default: String,
        front_shiny: String,
    },
});

const PokemonModel = mongoose.model('Pokemon', PokemonSchema);

module.exports = PokemonModel;
