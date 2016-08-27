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
    Paises.find().populate('_estadoId').exec(function (err, paises) {
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
    Paises.findById(id).populate('_estadoId').exec(function (err, pais) {
        if(err) return next(err);
        if(!pais) return next(new Error(`Failed to load pais id: ${id}`));
        req.pais = pais;
        next();
    });
};

exports.update = function(req, res) {
    var pais = req.pais;
    pais.nome_pais = req.body.nome_pais;
    pais.sigla_pais = req.body.sigla_pais;
    pais.nome_pais_en = req.body.nome_pais_en;
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
    if(_temEstadoAssociado(req)) {
        return res.status(400).send({
            message: 'O País não pode ser removido pois ainda há estados a ele vinculados'
        });
    }
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

exports.update_estado_pais = function(req, res) {
    _removeEstadoPaisAntigo(req, res);
    Paises.findById(req.params.paisId).exec(function (err, pais) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            pais._estadoId.push(req.params.estadoId);
            pais.save();
        }
    });
};

exports.delete_estado_pais = function(req, res) {
    Paises.findById(req.params.pais).exec(function (err, pais) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            var index = pais._estadoId.indexOf(req.params.estadoId);
            if(index > -1) {
                pais._estadoId.splice(index, 1);
            }
        }
        pais.save();
    });
};

/**
 * Remove a objectId de um estado da lista de estados vinculados a um país
 * @param req
 * @param res
 * @private
 */
function _removeEstadoPaisAntigo(req, res) {
    var estado_id = req.params.estadoId;
    Paises.findOne({_estadoId: estado_id}).exec(function (err, pais) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            if(pais){
                if(pais._doc.hasOwnProperty('_estadoId')) {
                    var index = pais._estadoId.indexOf(estado_id);
                    if(index > -1) {
                        pais._estadoId.splice(index, 1);
                        pais.save();
                    }
                }
            }
        }
    });
}

function _temEstadoAssociado(req) {
    return (req.pais._estadoId.length);
}