/**
 * Created by Vittorio on 30/05/2016.
 */

var mainAppModuleName = 'impsys';
var mainAppModule = angular.module(mainAppModuleName, ['ngResource', 'ngRoute', 'produtos', 'despesas', 'estudos', 'despesas', 'ngToast', 'ui.router', 'ngAnimate']);
//todo: Ver se dá pra tirar o ui.router daí.

mainAppModule.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('!');
}]);

if(window.location.hash === '#_=_') window.location.hash = '#!';

angular.element(document).ready(function () {
    angular.bootstrap(document, [mainAppModuleName]);
});

