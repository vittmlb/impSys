/**
 * Created by Vittorio on 14/08/2016.
 */
angular.module('estados').controller('EstadosController', ['$scope', '$stateParams', '$location', 'Estados', 'Paises',
    function($scope, $stateParams, $location, Estados, Paises) {
        $scope.ListaPaises = Paises.query();
        $scope.create = function() {
            var estado = new Estados({
                nome_estado: this.nome_estado,
                sigla_estado: this.sigla_estado,
                pais_estado: this.pais_estado
            });
            estado.$save(function (response) {
                $location.path('/estados/' + response._id);
            }, function(errorResponse) {
                console.log(errorResponse);
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.find = function() {
            $scope.estados = Estados.query();
        };
        $scope.findOne = function() {
            $scope.estado = Estados.get({
                estadoId: $stateParams.estadoId
            });
        };
        $scope.update = function() {
            $scope.estado.$update(function (response) {
                $location.path('/estados/' + response._id);
            }, function(errorResponse) {
                console.log(errorResponse);
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.delete = function(estado) {
            if(estado) {
                estado.$remove(function() {
                    for(var i in $scope.estados) {
                        if($scope.estados[i] === estado) {
                            $scope.estados.splice(i, 1);
                        }
                    }
                })
            } else {
                $scope.estado.$remove(function () {
                    $location.path('/estados');
                }, function(errorResponse) {
                    console.log(errorResponse);
                    $scope.error = errorResponse.data.message;
                });
            }
        };
    }
]);