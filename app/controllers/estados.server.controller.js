/**
 * Created by Vittorio on 14/08/2016.
 */
var Estados = require('mongoose').model('Estado');
var paises = require('./paises.server.controller');

exports.create = function(req, res) {
    var estado = new Estados(req.body);
    estado.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            add_pais(req, res, estado);
            res.json(estado);
        }
    });
};

exports.list = function(req, res) {
    Estados.find().populate('pais_estado').populate('_cidadeId').exec(function (err, estados) {
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
    Estados.findById(id).populate('pais_estado').populate('_cidadeId').exec(function (err, estado) {
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
            update_pais(req, res);
            res.json(estado);
        }
    });
};

exports.delete = function(req, res) {
    var estado = req.estado;
    if(_temCidadeAssociado(req)) {
        return res.status(400).send({
            message: 'O Estado não pode ser removido pois ainda há cidades a ele vinculados'
        });
    }
    estado.remove(function(err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            delete_pais(req, res);
            res.json(estado);
        }
    })
};

// Funçoes para atualizar objectIds em outros objetos.

/**
 * Adiciona a _id do estado à lista de ids ( [_estadoId]) de estados no objeto país
 * @param req
 * @param res
 * @param estado
 */
function add_pais(req, res, estado) {
    req.params.estadoId = estado._id;
    req.params.paisId = estado.pais_estado;
    paises.update_estado_pais(req, res);
}
function update_pais(req, res) {
    req.params.paisId = req.body.pais_estado._id;
    paises.update_estado_pais(req, res);
}
function delete_pais(req, res) {
    req.params.paisId = req.estado.pais_estado._id;
    req.params.estadoId = req.estado._id;
    paises.delete_estado_pais(req, res);
}

// Cidades
exports.update_cidade_estado = function(req, res) {
    _removeCidadeEstadoAntigo(req, res);
    Estados.findById(req.params.estadoId).exec(function (err, estado) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            estado._cidadeId.push(req.params.cidadeId);
            estado.save();
        }
    });
};
exports.delete_cidade_estado = function(req, res) {
    Estados.findById(req.params.estadoId).exec(function (err, estado) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            var index = estado._cidadeId.indexOf(req.params.cidadeId);
            if(index > -1) {
                estado._cidadeId.splice(index, 1);
            }
        }
        estado.save();
    });
};

/**
 * Remove a objectId de uma cidade da lista de cidades vinculadas a um estado
 * @param req
 * @param res
 * @private
 */
function _removeCidadeEstadoAntigo(req, res) {
    var cidade_id = req.params.cidadeId;
    Estados.findOne({_cidadeId: cidade_id}).exec(function (err, estado) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            if(estado){
                if(estado._doc.hasOwnProperty('_cidadeId')) {
                    var index = estado._cidadeId.indexOf(cidade_id);
                    if(index > -1) {
                        estado._cidadeId.splice(index, 1);
                        estado.save();
                    }
                }
            }
        }
    });
}
function _temCidadeAssociado(req) {
    return (req.estado._cidadeId.length);
}