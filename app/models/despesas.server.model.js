/**
 * Created by Vittorio on 01/06/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var DespesasSchema = new Schema({
    nome: {
        type: String,
        trim: true,
        required: 'O campo nome é obrigatório'
    },
    tipo: {
        type: String,
        enum: ['despesa aduaneira', 'alíquota', 'outras']
    },
    valor: {
        type: Currency,
        get: function(value) {
            return value / 100;
        }
    },
    moeda: {
        type: String,
        enum: ['R$', 'U$']
    },
    aliquota: {
        type: Number
    },
    ativa: {
        type: Boolean,
        default: true
    }
});

DespesasSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('Despesa', DespesasSchema);