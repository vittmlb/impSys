/**
 * Created by Vittorio on 30/05/2016.
 */
angular.module('produtos').config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/produtos', {
        templateUrl: 'app/produtos/views/list-produtos.client.view.html'
    }).when('/produtos/:produtoId', {
        templateUrl: 'app/produtos/views/view-produto.client.view.html'
    }).when('/produtos/:produtoId/edit', {
        templateUrl: 'app/produtos/views/edit-produto.client.view.html'
    }).when('/produtos/create', {
        templateUrl: 'app/produtos/views/create-produto.client.view.html'
    });
}]);