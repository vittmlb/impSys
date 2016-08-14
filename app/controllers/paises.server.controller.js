/**
 * Created by Vittorio on 13/08/2016.
 */
var Paises = require('mongoose').model('Pais');

exports.create = function(req, res) {
    var pais = new Paises(req.body);
    pais.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(pais);
        }
    });
};

exports.list = function(req, res) {
    Paises.find().exec(function (err, paises) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(paises);
        }
    });
};

exports.read = function(req, res) {
    res.json(req.pais);
};

exports.findById = function(req, res, next, id) {
    Paises.findById(id).exec(function (err, pais) {
        if(err) return next(err);
        if(!pais) return next(new Error(`Failed to load pais id: ${id}`));
        req.pais = pais;
        next();
    });
};

exports.update = function(req, res) {
    var pais = req.pais;
    pais.nome_pais = req.body.pais;
    pais.sigla_pais = req.body.sigla_pais;
    pais.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(pais);
        }
    });
};

exports.delete = function(req, res) {
    var pais = req.pais;
    pais.remove(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(pais);
        }
    });
};