/**
 * Created by Vittorio on 30/05/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var ProdutoSchema = new Schema({
    nome: {
        type: String,
        default: '',
        trim: true
    },
    modelo: {
        type: String,
        default: '',
        trim: true
    },
    descricao: {
        type: String,
        default: '',
        trim: true
    },
    custo_usd: {
        type: Currency,
        default: 0,
        get: function(value) {
            return value / 100;
        }
    },
    ncm: {
        type: String,
        trim: true
    },
    impostos: {
        ii: {
            type: Number
        },
        ipi: Number,
        pis: Number,
        cofins: Number
    },
    medidas: {
        cbm: Number,
        peso: Number
    },
    website: {
        type: String,
        default: '',
        trim: true
    },
    notas: {
        type: String,
        default: ''
    }
});

ProdutoSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('Produto', ProdutoSchema);

