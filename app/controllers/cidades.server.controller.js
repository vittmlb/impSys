/**
 * Created by Vittorio on 14/08/2016.
 */
var Cidades = require('mongoose').model('Cidade');
var Paises = require('mongoose').model('Pais');

exports.create = function(req, res) {
    var cidade = new Cidades(req.body);
    cidade.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(cidade);
        }
    });
};

exports.list = function(req, res) {
    Cidades.find().populate('estado_cidade').exec(function (err, cidades) {
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
    Cidades.findById(id).populate('estado_cidade').exec(function (err, cidade) {
        if(err) return next(err);
        if(!cidade) return next(new Error(`Failed to load cidade id: ${id}`));
        req.cidade = cidade;
        next();
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
            res.json(cidade);
        }
    });
};

exports.delete = function(req, res) {
    var cidade = req.cidade;
    cidade.remove(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(cidade);
        }
    });
};