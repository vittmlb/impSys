/**
 * Created by Vittorio on 01/06/2016.
 */

angular.module('despesas').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('despesas_create', {
                url: '/despesas/create',
                templateUrl: 'app/despesas/views/create-despesa.client.view.html',
                controller: 'DespesasController'
            })
            .state('despesas_lista', {
                url: '/despesas',
                templateUrl: 'app/despesas/views/list-despesas.client.view.html',
                controller: 'DespesasController'
            })
            .state('despesas_view', {
                url: '/despesas/:despesaId',
                templateUrl: 'app/despesas/views/view-despesa.client.view.html',
                controller: 'DespesasController'
            })
            .state('despesas_edit', {
                url: '/despesas/:despesaId/edit',
                templateUrl: 'app/despesas/views/edit-despesa.client.view.html',
                controller: 'DespesasController'
            });
    }
]);
