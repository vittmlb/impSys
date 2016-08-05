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
    NCMS.find().exec(function (err, ncms) {
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
    NCMS.findById(id).exec(function (err, ncm) {
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