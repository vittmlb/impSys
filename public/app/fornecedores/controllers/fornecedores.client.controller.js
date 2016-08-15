/**
 * Created by Vittorio on 13/08/2016.
 */
angular.module('fornecedores').controller('FornecedoresController', ['$scope', '$stateParams', '$location', 'Fornecedores', 'Cidades',
    function($scope, $stateParams, $location, Fornecedores, Cidades) {
        $scope.ListaCidades = Cidades.query();

        $scope.create = function() {
            var fornecedor = new Fornecedores({
                nome_fornecedor: this.nome_fornecedor,
                razao_social: this.razao_social,
                email: this.email,
                cidade_fornecedor: this.cidade_fornecedor
            });
            fornecedor.$save(function (response) {
                $location.path('/fornecedores/' + response._id);
            }, function(errorResponse) {
                console.log(errorResponse);
                $scope.error = errorResponse;
            });
        };
        $scope.find = function() {
            $scope.fornecedores = Fornecedores.query();
        };
        $scope.findOne = function() {
            $scope.fornecedor = Fornecedores.get({
                fornecedorId: $stateParams.fornecedorId
            });
        };
        $scope.update = function() {
            $scope.fornecedor.$update(function (response) {
                $location.path('/fornecedores/' + response._id);
            }, function(errorResponse) {
                console.log(errorResponse);
                $scope.error = errorResponse;
            });
        };
        $scope.delete = function(fornecedor) {
            if(fornecedor) {
                fornecedor.$remove(function () {
                    for(var i in $scope.fornecedores) {
                        if($scope.fornecedores[i] === fornecedor) {
                            $scope.fornecedores.splice(i, 1);
                        }
                    }
                });
            } else {
                $scope.fornecedor.$remove(function () {
                    $location.path('/fornecedores');
                }, function(errorResponse) {
                    console.log(errorResponse);
                    $scope.error = errorResponse;
                });
            }
        };
        $scope.teste = function(forn) {
            var teste = 10;
            var b = 20;
        };
    }
]);