/**
 * Created by Vittorio on 30/05/2016.
 */
angular.module('estudos').controller('EstudosController', ['$scope', '$routeParams', '$location', 'Produtos',
    function($scope, $routeParams, $location, Produtos) {

        $scope.produtosDoEstudo = [];
        $scope.estudo = {
            totalFob: 0
        };
        
        $scope.listProdutos = function() {
            $scope.produtos = Produtos.query();
        };
        
        $scope.selecionaProdutoEstudo = function(item) {
            $scope.produtosDoEstudo.push(item);
            iniImport();
        };


        function calculaFob(produto) {
            return Number(produto.custo_usd) * 10;
        }


        function iniImport() {
            $scope.produtosDoEstudo.forEach(function (produto) {
                $scope.estudo.totalFob += calculaFob(produto);
            });
        }
        
    }
]);

