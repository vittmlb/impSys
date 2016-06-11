/**
 * Created by Vittorio on 30/05/2016.
 */
angular.module('produtos').controller('ProdutosController', ['$scope', '$routeParams', '$location', 'Produtos', '$stateParams', '$state',
    function($scope, $routeParams, $location, Produtos, $stateParams, $state) {

        $scope.volCBM20 = '';
        $scope.qtdCBM20 = '';
        $scope.volCBM40 = '';
        $scope.qtdCBM40 = '';
        $scope.largura = '';
        $scope.altura = '';
        $scope.comprimento = '';
        $scope.cbmProduto20 = '';
        $scope.cbmProduto40 = '';
        $scope.cbmProdutoMedidas = '';
        
        $scope.calculaCBM = function(item) {
            if(item === 20) {
                if ($scope.volCBM20 > 0 && $scope.qtdCBM20 > 0) {
                    $scope.cbmProduto20 = Number($scope.volCBM20 / $scope.qtdCBM20);
                } else {
                    $scope.cbmProduto20 = '';
                }
            } else if (item === 40) {
                if ($scope.volCBM40 > 0 && $scope.qtdCBM40 > 0) {
                    $scope.cbmProduto40 = $scope.volCBM40 / $scope.qtdCBM40;
                } else {
                    $scope.cbmProduto40 = '';
                }
            } else if (item === 'medidas') {
                if ($scope.largura > 0 && $scope.altura > 0 && $scope.comprimento > 0) {
                    $scope.cbmProdutoMedidas = $scope.largura * $scope.altura * $scope.comprimento;
                } else {
                    $scope.cbmProdutoMedidas = '';
                }
            }
        };

        $scope.create = function() {
            var produto = new Produtos({
                nome: this.nome,
                modelo: this.modelo,
                descricao: this.descricao,
                custo_usd: this.custo_usd,
                ncm: this.ncm,
                impostos: {
                    ii: this.impostos.ii,
                    ipi: this.impostos.ipi,
                    pis: this.impostos.pis,
                    cofins: this.impostos.cofins
                },
                medidas: {
                    cbm: this.medidas.cbm,
                    peso: this.medidas.peso
                },
                website: this.website,
                notas: this.notas
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
