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
    },
    nome_pais_en: {
        type: String,
        trim: true,
        required: true,
    }
});

PaisSchema.virtual('flag_url').get(function (size) {
    return `/uploads/flags/${size}/${this.nome_pais_en}.png`;
});

PaisSchema.set('toJSON', {
    virtuals: true
});

mongoose.model('Pais', PaisSchema);