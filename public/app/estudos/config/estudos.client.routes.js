/**
 * Created by Vittorio on 30/05/2016.
 */
angular.module('estudos').config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/estudos', {
        templateUrl: 'app/estudos/views/main-estudos.client.view.html'
    });
}]);