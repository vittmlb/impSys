/**
 * Created by Vittorio on 13/08/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaisSchema = new Schema({
    nome_pais: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    sigla_pais: {
        type: String,
        trim: true
    }
});

mongoose.model('Pais', PaisSchema);