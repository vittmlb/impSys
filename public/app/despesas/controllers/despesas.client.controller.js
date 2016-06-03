/**
 * Created by Vittorio on 01/06/2016.
 */
angular.module('despesas').controller('DespesasController', ['$scope', '$routeParams', '$location', 'Despesas', 'ngToast', '$stateParams', '$state',
    function($scope, $routeParams, $location, Despesas, ngToast, $stateParams, $state) {
        $scope.create = function() {
            var despesa = new Despesas({
                nome: this.nome
            });
            despesa.$save(function(response) {
                $location.path('/despesas/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                ngToast.danger(errorResponse.data.message);
            });
        };
        $scope.find = function() {
            $scope.despesas = Despesas.query()
        };
        $scope.findOne = function() {
            $scope.despesa = Despesas.get({
                despesaId: $stateParams.despesaId
            });
        };
        $scope.delete = function(despesa) {
            if(despesa) {
                despesa.$remove(function () {
                    for (var i in $scope.despesas) {
                        if($scope.despesas[i] === despesa) {
                            $scope.despesas.splice(i, 1);
                        }
                    }
                });
            } else {
                $scope.despesa.$remove(function () {
                    $location.path('/despesas');
                });
            }
        };
        $scope.update = function() {
            $scope.despesa.$update(function () {
                $location.path('/despesas/' + $scope.despesa._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
                ngToast.danger(errorResponse.data.message);
            });
        };
    }
]);