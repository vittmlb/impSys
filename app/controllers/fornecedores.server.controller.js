/**
 * Created by Vittorio on 13/08/2016.
 */

var Fornecedores = require('mongoose').model('Fornecedor');
var Cidades = require('mongoose').model('Cidade');
var Estados = require('mongoose').model('Estado');
var cidades = require('./cidades.server.controller');

exports.create = function(req, res) {
    var fornecedor = new Fornecedores(req.body);
    fornecedor.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            add_cidade(req, res, fornecedor);
            res.json(fornecedor);
        }
    });
};

exports.list = function(req, res) {
    Fornecedores.find().populate('cidade_fornecedor').populate('estado_cidade').exec(function (err, fornecedores) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(fornecedores);
        }
    });
};

exports.read = function(req, res) {
    res.send(req.fornecedor);
};

exports.findById = function(req, res, next, id) {
    Fornecedores.findById(id).populate({
        path: 'cidade_fornecedor',
        populate: {path: 'estado_cidade', populate: {path: 'pais_estado'}}
    }).exec(function (err, fornecedor) {
        if(err) return next(err);
        if(!fornecedor) return next(new Error(`Failed to load fornecedor id: ${id}`));
        req.fornecedor = fornecedor;
        next();
    });
};

exports.findByIdOld = function(req, res, next, id) {
    Fornecedores.findById(id).populate({
        path: 'cidade_fornecedor',
        populate: {path: 'estado_cidade', populate: {path: 'pais_estado'}}
    }).exec(function (err, fornecedor) {
        if(err) return next(err);
        if(!fornecedor) return next(new Error(`Failed to load fornecedor id: ${id}`));
        req.fornecedor = fornecedor;
        next();
    });
};


exports.update = function(req, res) {
    var fornecedor = req.fornecedor;
    fornecedor.nome_fornecedor = req.body.nome_fornecedor;
    fornecedor.razao_social = req.body.razao_social;
    fornecedor.email = req.body.email;
    fornecedor.cidade_fornecedor = req.body.cidade_fornecedor;
    fornecedor.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            update_cidade(req, res);
            res.json(fornecedor);
        }
    });
};

exports.delete = function(req, res) {
    var fornecedor = req.fornecedor;
    if(_temProdutoAssociado(req)) {
        return res.status(400).send({
            message: 'O fornecedor não pode ser removido pois ainda há produtos a ele vinculados'
        });
    }
    fornecedor.remove(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            delete_cidade(req, res, fornecedor);
            res.json(fornecedor);
        }
    });
};

// Funçoes para atualizar objectIds em outros objetos.
function add_cidade(req, res, fornecedor) {
    req.params.fornecedorId = fornecedor._id;
    req.params.cidadeId = fornecedor.cidade_fornecedor;
    cidades.update_fornecedor_cidade(req, res);
}
function update_cidade(req, res) {
    req.params.cidadeId = req.fornecedor.cidade_fornecedor._id;
    cidades.update_fornecedor_cidade(req, res);
}
function delete_cidade(req, res, fornecedor) {
    req.params.cidade = fornecedor.cidade_fornecedor;
    cidades.delete_fornecedor_cidade(req, res);
}

// Produtos
exports.update_fornecedor_do_produto = function(req, res) {
    _removeProdutoFornecedorAntigo(req, res);
    Fornecedores.findById(req.params.fornecedorId).exec(function (err, fornecedor) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            fornecedor._produtoId.push(req.params.produtoId);
            fornecedor.save(); // todo: Escrever funçao callback.
        }
    });
};
exports.delete_fornecedor_do_produto = function(req, res) {
    _removeProdutoFornecedorAntigo(req, res);
};

function _removeProdutoFornecedorAntigo(req, res) {
    var produto_id = req.params.produtoId;
    Fornecedores.findOne({_produtoId: produto_id}).exec(function (err, fornecedor) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            if(fornecedor) {
                if(fornecedor._doc.hasOwnProperty('_produtoId')) {
                    var index = fornecedor._produtoId.indexOf(produto_id);
                    if(index > -1) {
                        fornecedor._produtoId.splice(index, 1);
                        fornecedor.save();
                    }
                }
            }
        }
    });
}
function _temProdutoAssociado(req) {
    return (req.fornecedor._produtoId.length);
}