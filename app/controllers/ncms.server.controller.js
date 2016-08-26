/**
 * Created by Vittorio on 04/08/2016.
 */

var NCMS = require('mongoose').model('NCM');

exports.create = function(req, res) {
    var ncm = new NCMS(req.body);
    ncm.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(ncm);
        }
    });
};

exports.list = function(req, res) {
    NCMS.find().populate('_produtoId').exec(function (err, ncms) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(ncms);
        }
    });
};

exports.read = function(req, res) {
    res.json(req.ncm);
};

exports.findById = function(req, res, next, id) {
    NCMS.findById(id).populate('_produtoId').exec(function (err, ncm) {
        if(err) return next(err);
        if(!ncm) return next(new Error(`Failed to load ncm id: ${id}`));
        req.ncm = ncm;
        next();
    });
};

exports.update = function(req, res) {
    var ncm = req.ncm;
    ncm.cod_ncm = req.body.cod_ncm;
    ncm.descricao = req.body.descricao;
    ncm.li = req.body.li;
    ncm.impostos = req.body.impostos;
    ncm.obs = req.body.obs;
    ncm.save(function (err) {
        if(err) {
            return req.status(400).send({
                message: err
            });
        } else {
            res.json(ncm);
        }
    });
};

exports.delete = function(req, res) {
    var ncm = req.ncm;
    if(_temProdutoAssociado(req)){
        return res.status(400).send({
            message: 'O NCM não pode ser excluído pois ainda há produtos a ele vinculados'
        });
    }
    ncm.remove(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(ncm);
        }
    });
};

exports.update_ncm_produto = function(req, res) {
    _removeProdutoNcmAntigo(req, res);
    NCMS.findById(req.params.ncmId).exec(function (err, ncm) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            ncm._produtoId.push(req.params.produtoId);
            ncm.save(); // todo: Fazer callback.
        }
    });
};
exports.delete_ncm_produto = function(req, res) {
    NCMS.findById(req.params.ncm).exec(function (err, ncm) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            var index = ncm._produtoId.indexOf(req.params.produtoId);
            if(index > -1) {
                ncm._produtoId.splice(index, 1);
            }
            ncm.save();
        }
    });
};

function _removeProdutoNcmAntigo(req, res) {
    var produto_id = req.params.produtoId;
    NCMS.findOne({_produtoId: req.params.produtoId}).exec(function (err, ncm) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            if(ncm){
                if(ncm._doc.hasOwnProperty('_produtoId')) {
                    var index = ncm._produtoId.indexOf(produto_id);
                    if(index > -1) {
                        ncm._produtoId.splice(index, 1);
                        ncm.save();
                    }
                }
            }
        }
    });
}

function _temProdutoAssociado(req) {
    return (req.ncm._produtoId.length);
}