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
    custo_usd: {
        type: Currency,
        default: 0
    }
});

mongoose.model('Produto', ProdutoSchema);
