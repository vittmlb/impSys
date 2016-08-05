/**
 * Created by Vittorio on 04/08/2016.
 */
angular.module('ncms').factory('Ncms', ['$resource', function ($resource) {
    return $resource('/api/ncms/:ncmId', {
        ncmId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);