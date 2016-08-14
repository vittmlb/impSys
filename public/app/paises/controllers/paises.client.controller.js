/**
 * Created by Vittorio on 13/08/2016.
 */
angular.module('paises').controller('PaisesController', ['$scope', '$stateParams', '$location', 'Paises',
    function($scope, $stateParams, $location, Paises) {
        $scope.create = function() {
            var pais = new Paises({
                nome_pais: this.nome_pais,
                sigla_pais: this.sigla_pais
            });
            pais.$save(function (response) {
                $location.path('/paises/' + response._id);
            }, function(errorResponse) {
                console.log(errorResponse);
                $scope.error = errorResponse.data.message; // todo: O que fazer com esse .data.message?
            });
        };
        $scope.find = function() {
            $scope.paises = Paises.query();
        };
        $scope.findOne = function() {
            $scope.pais = Paises.get({
                paisId: $stateParams.paisId
            });
        };
        $scope.update = function() {
            $scope.pais.$update(function (response) {
                $location.path('/paises/' + response._id);
            }, function(errorResponse) {
                console.log(errorResponse);
                $scope.error = errorResponse.data.message; // todo: .data.message??
            });
        };
        $scope.delete = function(pais) {
            if(pais) {
                pais.$remove(function () {
                    for(var i in $scope.paises) {
                        if($scope.paises[i] === pais) {
                            $scope.paises.splice(i, 1);
                        }
                    }
                });
            } else {
                $scope.pais.$remove(function () {
                    $location.path('/paises/');
                }, function(errorResponse) {
                    console.log(errorResponse);
                    $scope.error = errorResponse.data.message; // todo: .data.message
                });
            }
        };
    }
]);