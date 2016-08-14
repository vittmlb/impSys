/**
 * Created by Vittorio on 14/08/2016.
 */
var Estados = require('mongoose').model('Estado');

exports.create = function(req, res) {
    var estado = new Estados(req.body);
    estado.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(estado);
        }
    });
};

exports.list = function(req, res) {
    Estados.find().populate('pais_estado').exec(function (err, estados) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(estados);
        }
    });
};

exports.read = function(req, res) {
    res.json(req.estado);
};

exports.findById = function(req, res, next, id) {
    Estados.findById(id).populate('pais_estado').exec(function (err, estado) {
        if(err) return next(err);
        if(!estado) return next(new Error(`Failed to load estado id: ${id}`));
        req.estado = estado;
        next();
    });
};

exports.update = function(req, res) {
    var estado = req.estado;
    estado.nome_estado = req.body.nome_estado;
    estado.sigla_estado = req.body.sigla_estado;
    estado.pais_estado = req.body.pais_estado;
    estado.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(estado);
        }
    });
};

exports.delete = function(req, res) {
    var estado = req.estado;
    estado.remove(function(err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(estado);
        }
    })
};