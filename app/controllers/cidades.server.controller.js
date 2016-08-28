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
    var query = Cidades.find().populate('estado_cidade').exec(function (err, cidades) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            if(cidades) {
                cidades.forEach(function (cidade) {
                    var queryNew = Estados.findById(cidade.estado_cidade._id).populate('pais_estado').exec(function (err, estado) {
                        cidade.estado_cidade = estado;
                    });
                    queryNew.then(function (data) {
                        return cidades;
                    });
                });
            }
        }
    });
    query.then(function (data) {
        res.json(data);
    });
};

exports.listOld = function(req, res) {
    Cidades.find().populate('estado_cidade').populate('pais_estado').exec(function (err, cidades) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            if(cidades) {
                cidades.forEach(function (cidade) {
                    Estados.findById(cidade.estado_cidade._id).populate('pais_estado').exec(function (err, estado) {
                        cidade.estado_cidade = estado;
                    });
                });
                res.json(cidades);
            }
        }
    });
};

exports.read = function(req, res) {
    res.json(req.cidade);
};

exports.findById = function(req, res, next, id) {
    var query = Cidades.findById(id).populate('estado_cidade').exec(function (err, cidade) {
        if(err) return next(err);
        if(!cidade) return next(new Error(`Failed to load cidade id: ${id}`));
    });
    query.then(function (cidade) {
        Estados.findById(cidade.estado_cidade._id).populate('pais_estado').exec(function (err, estado) {
            cidade.estado_cidade = estado;
            req.cidade = cidade;
            next();
        });
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
