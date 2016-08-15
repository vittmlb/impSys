/**
 * Created by Vittorio on 13/08/2016.
 */

var Fornecedores = require('mongoose').model('Fornecedor');

exports.create = function(req, res) {
    var fornecedor = new Fornecedores(req.body);
    fornecedor.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
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
    Fornecedores.findById(id).populate('cidade_fornecedor').populate('estado_cidade').exec(function (err, fornecedor) {
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
            res.json(fornecedor);
        }
    });
};

exports.delete = function(req, res) {
    var fornecedor = req.fornecedor;
    fornecedor.remove(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(fornecedor);
        }
    });
};