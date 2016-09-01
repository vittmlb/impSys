/**
 * Created by Vittorio on 31/08/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmailSchema = new Schema({
    descricao_email: {
        type: String,
        trim: true,
        default: 'Principal'
    },
    email: {
        type: String,
        trim: true
    }
});

var ContatosSchema = new Schema({
    nome_contato: {
        type: String,
        trim: true,
        required: true
    },
    emails: [{
        descricao_email: {
            type: String,
            trim: true,
            default: 'Principal'
        },
        email: {
            type: String,
            trim: true
        }
    }],
    fornecedor: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Fornecedor'
    }
});

mongoose.model('Contato', ContatosSchema);