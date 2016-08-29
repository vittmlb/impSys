/**
 * Created by Vittorio on 14/08/2016.
 */
var Cidades = require('mongoose').model('Cidade');
var Estados = require('mongoose').model('Estado');
var estados = require('./estados.server.controller');

exports.create = function(req, res) {
    var cidade = new Cidades(req.body);
    cidade.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            update_estado(req, res);
            res.json(cidade);
        }
    });
};

exports.list = function(req, res) {
    Cidades.find().populate({path: 'estado_cidade', populate: {path: 'pais_estado'}}).exec(function (err, cidades) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(cidades);
        }
    });

};

exports.read = function(req, res) {
    res.json(req.cidade);
};

exports.findById = function(req, res, next, id) {
    Cidades.findById(id).populate({
        path: 'estado_cidade',
        populate: {path: 'pais_estado'}
        })
        .populate('_fornecedorId')
        .exec(function (err, cidade) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(cidade);
        }
    });
};

exports.update = function(req, res) {
    var cidade = req.cidade;
    cidade.nome_cidade = req.body.nome_cidade;
    cidade.estado_cidade = req.body.estado_cidade;
    cidade.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            update_estado(req, res);
            res.json(cidade);
        }
    });
};

exports.delete = function(req, res) {
    var cidade = req.cidade;
    if(_temFornecedorAssociado(req)) {
        return res.status(400).send({
            message: 'A Cidade não pode ser removida pois ainda há fornecedores a ele vinculados'
        });
    }
    cidade.remove(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            delete_estado(req, res);
            res.json(cidade);
        }
    });
};

// Funçoes para atualizar objectIds em outros objetos.
function update_estado(req, res) {
    // req.params.estadoId = req.body.estado._id;
    req.params.estadoId = req.cidade.estado_cidade._id;
    estados.update_cidade_estado(req, res);
}
function delete_estado(req, res) {
    req.params.cidade = req.cidade.estado_cidade._id;
    estados.delete_cidade_estado(req, res);
}

// Fornecedores
exports.update_fornecedor_cidade = function(req, res) {
    _removeFornecedorCidadeAntigo(req, res);
    Cidades.findById(req.params.cidadeId).exec(function (err, cidade) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            cidade._fornecedorId.push(req.params.fornecedorId);
            cidade.save();
        }
    });
};
exports.delete_fornecedor_cidade = function(req, res) {
    Cidades.findById(req.params.cidade).exec(function (err, cidade) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            var index = cidade._fornecedorId.indexOf(req.params.fornecedorId);
            if(index > -1) {
                cidade._fornecedorId.splice(index, 1);
            }
        }
        cidade.save();
    });
};

/**
 * Remove a objectId de uma cidade da lista de cidades vinculadas a um estado
 * @param req
 * @param res
 * @private
 */
function _removeFornecedorCidadeAntigo(req, res) {
    var fornecedor_id = req.params.fornecedorId;
    Cidades.findOne({_fornecedorId: fornecedor_id}).exec(function (err, cidade) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            if(cidade){
                if(cidade._doc.hasOwnProperty('_fornecedorId')) {
                    var index = cidade._fornecedorId.indexOf(fornecedor_id);
                    if(index > -1) {
                        cidade._fornecedorId.splice(index, 1);
                        cidade.save();
                    }
                }
            }
        }
    });
}
function _temFornecedorAssociado(req) {
    return (req.cidade._fornecedorId.length);
}
