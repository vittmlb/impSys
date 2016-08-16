/**
 * Created by Vittorio on 15/08/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigSchema = new Schema({
    taxa_paypal: {
        type: Number
    },
    iof_cartao: {
        type: Number
    },
    comissao_ml: {
        type: Number
    },
    aliquota_simples: {
        type: Number
    },
    percentual_comissao_conny: {
        type: Number
    }
});

var EstudoSchema = new Schema({
    cotacao_dolar: {
        type: Number
    },
    config: ConfigSchema
});

mongoose.model('Estudo', EstudoSchema);