/**
 * Created by Vittorio on 01/06/2016.
 */
angular.module('despesas').config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/despesas', {
        templateUrl: 'app/despesas/views/list-despesas.client.view.html'
    }).when('/despesas/create', {
        templateUrl: 'app/despesas/views/create-despesa.client.view.html'
    }).when('/despesas/:despesaId', {
        templateUrl: 'app/despesas/views/view-despesa.client.view.html'
    }).when('/despesas/:despesaId/edit', {
        templateUrl: 'app/despesas/views/edit-despesa.client.view.html'
    });
}]);