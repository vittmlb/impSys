/**
 * Created by Vittorio on 30/05/2016.
 */
angular.module('estudos').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('estudos_main', {
                url: '/estudos',
                templateUrl: 'app/estudos/views/main-estudos.client.view.html'
            });
    }
]);
