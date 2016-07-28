/**
 * Created by Vittorio on 30/05/2016.
 */

angular.module('produtos').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('/produto_create', {
                url: '/produtos/create',
                templateUrl: 'app/produtos/views/create-produto.client.view.html',
                controller: 'ProdutosController'
            })
            .state('/produto_lista', {
                url: '/produtos',
                templateUrl: 'app/produtos/views/list-produtos.client.view.html',
                controller: 'ProdutosController'
            })
            .state('/produto_view', {
                url: '/produtos/:produtoId',
                templateUrl: 'app/produtos/views/view-produto.client.view.html',
                controller: 'ProdutosController'
            })
            .state('/produto_edit', {
                url: '/produtos/:produtoId/edit',
                templateUrl: 'app/produtos/views/edit-produto.client.view.html'
            });
    }
]);