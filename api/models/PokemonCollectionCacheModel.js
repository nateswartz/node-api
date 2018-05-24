const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PokemonCollectionCacheSchema = new Schema({
    request_url: String,
    results: [{
        name: String,
        url: String,
    }],
    next: String,
});

const PokemonCollectionCacheModel =
    mongoose.model('PokemonCollectionCache', PokemonCollectionCacheSchema);

module.exports = PokemonCollectionCacheModel;
