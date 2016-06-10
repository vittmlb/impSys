/**
 * Created by Vittorio on 30/05/2016.
 */
var Produtos = require('mongoose').model('Produto');

exports.create = function(req, res) {
    var produto = new Produtos(req.body);
    produto.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(produto);
        }
    });
};

exports.list = function(req, res) {
    Produtos.find().exec(function (err, produtos) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(produtos);
        }
    });
};

exports.read = function(req, res) {
    res.send(req.produto);
};

exports.delete = function(req, res) {
    var produto = req.produto;
    produto.remove(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(produto);
        }
    });
};

exports.update = function(req, res) {
    var produto = req.produto;
    produto.nome = req.body.nome;
    produto.modelo = req.body.modelo;
    produto.descricao = req.body.descricao;
    produto.custo_usd = req.body.custo_usd;
    produto.ncm = req.body.ncm;
    produto.impostos = req.body.impostos;
    produto.medidas = req.body.medidas;
    produto.website = req.body.website;
    produto.notas = req.body.notas;
    produto.save(function (err, produto) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(produto);
        }
    });
};

exports.findById = function(req, res, next, id) {
    Produtos.findById(id).exec(function (err, produto) {
        if(err) return next(err);
        if(!produto) return next(new Error(`Failed to load produto id: ${id}`));
        req.produto = produto;
        next();
    });
};