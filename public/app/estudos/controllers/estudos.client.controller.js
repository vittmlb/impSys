/**
 * Created by Vittorio on 30/05/2016.
 */
angular.module('estudos').controller('EstudosController', ['$scope', '$routeParams', '$location', 'Produtos',
    function($scope, $routeParams, $location, Produtos) {

        $scope.quantidades = [];
        $scope.produtosDoEstudo = [];
        $scope.estudo = {
            totalFob: 0
        };

        $scope.listProdutos = function() {
            $scope.produtos = Produtos.query();
        };
        
        $scope.selecionaProdutoEstudo = function(item) {
            item.qtd = 0;
            $scope.produtosDoEstudo.push(item);
        };


        function calculaFob(produto) {
            return Number(produto.custo_usd) * produto.qtd;
        }

        $scope.iniImport = function() {
            $scope.estudo.totalFob = 0;
            $scope.produtosDoEstudo.forEach(function (produto) {
                $scope.estudo.totalFob += calculaFob(produto);
            });
        }
        
    }
]);

