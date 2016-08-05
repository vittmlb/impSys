/**
 * Created by Vittorio on 04/08/2016.
 */
angular.module('ncms').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('ncm_create', {
                url: '/ncms/create',
                templateUrl: 'app/ncms/views/create-ncm.client.view.html',
                controller: 'NcmsController'
            })
            .state('ncm_list', {
                url: '/ncms',
                templateUrl: 'app/ncms/views/list-ncms.client.view.html',
                controller: 'NcmsController'
            })
            .state('ncm_view', {
                url: '/ncms/:ncmId',
                templateUrl: 'app/ncms/views/view-ncm.client.view.html',
                controller: 'NcmsController'
            })
            .state('ncm_edit', {
                url: '/ncms/:ncmId/edit',
                templateUrl: 'app/ncms/views/edit-ncm.client.view.html',
                controller: 'NcmsController'
            });
    }
]);