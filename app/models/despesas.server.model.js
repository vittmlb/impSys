/**
 * Created by Vittorio on 01/06/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var DespesasSchema = new Schema({
    nome: {
        type: String
    }
});

mongoose.model('Despesa', DespesasSchema);