/**
 * Created by Vittorio on 04/08/2016.
 */

var ncms = require('../controllers/ncms.server.controller');

module.exports = function(app) {

    app.route('/api/ncms')
        .get(ncms.list)
        .post(ncms.create);

    app.route('/api/ncms/:ncmId')
        .get(ncms.read)
        .put(ncms.update)
        .delete(ncms.delete);

    app.param('ncmId', ncms.findById);

};