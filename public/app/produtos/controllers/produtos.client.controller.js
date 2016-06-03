/**
 * Created by Vittorio on 30/05/2016.
 */
angular.module('produtos').controller('ProdutosController', ['$scope', '$routeParams', '$location', 'Produtos', '$stateParams', '$state',
    function($scope, $routeParams, $location, Produtos, $stateParams, $state) {
        $scope.create = function() {
            var produto = new Produtos({
                nome: this.nome,
                modelo: this.modelo,
                custo_usd: this.custo_usd
            });
            produto.$save(function (response) {
                $location.path('/produtos/' + response._id); // todo: Tentar usar o $state.go()
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.find = function() {
            $scope.produtos = Produtos.query();
        };
        $scope.findOne = function() {
            $scope.produto = Produtos.get({
                produtoId: $stateParams.produtoId
            });
        };
        $scope.delete = function(produto) {
            if(produto) {
                produto.$remove(function () {
                    for (var i in $scope.produtos) {
                        if($scope.produtos[i] === produto) {
                            $scope.produtos.splice(i, 1);
                        }
                    }
                });
            } else {
                $scope.produto.$remove(function () {
                    $location.path('/produtos');
                });
            }
        };
        $scope.update = function() {
            $scope.produto.$update(function () {
                $location.path('produtos/' + $scope.produto._id); // todo: Tentar usar também o $state.go()
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);
