/**
 * Created by Vittorio on 04/08/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NcmSchema = new Schema({
    cod_ncm: {
        type: String,
        trim: true,
        required: true
    },
    descricao: {
        type: String,
        trim: true,
        default: ''
    },
    li: {
        type: Boolean
    },
    impostos: {
        ii: {
            type: Number
        },
        ipi: Number,
        pis: Number,
        cofins: Number
    },
    obs: {
        type: String
    },
    _produtoId: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Produto'
    }]
});

NcmSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

NcmSchema.virtual('cod_com_descricao').get(function () {
    return this.cod_ncm + ' - ' + this.descricao;
});

mongoose.model('NCM', NcmSchema);