/**
 * Created by Vittorio on 30/05/2016.
 */
angular.module('estudos').controller('EstudosController', ['$scope', '$routeParams', '$location', 'Produtos', 'Despesas', '$stateParams', '$state',
    function($scope, $routeParams, $location, Produtos, Despesas, $stateParams, $state) {

        var cotacaoDolar = 2.68;

        $scope.quantidades = [];
        $scope.produtosDoEstudo = [];
        $scope.estudo = {
            cotacao_dolar: cotacaoDolar,
            totalFob: 0,
            totalPeso: 0,
            frete_maritimo_usd: 1600,
            frete_maritimo_brl: 0,
            seguro_usd: 0,
            seguro_brl: 0,
            aliq_icms: 0.16, // todo: Carregar esta informação à partir do objeto despesas.
            cif: 0,
            cif_brl: 0,
            seguro: 100,
            afrmm: 0,
            afrmm_brl: 0,
            tributos: {
                ii: 0,
                ipi: 0,
                pis: 0,
                cofins: 0,
                icms: 0,
                total_dos_tributos: 0
            },
            total_despesas: 0
        };


        $scope.loadData = function() {
            $scope.produtos = Produtos.query();
            $scope.despesas = Despesas.query();
        };
        
        $scope.adicionaProdutoEstudo = function(item) {
            item.qtd = 0;
            item.estudo = {};
            $scope.produtosDoEstudo.push(item);
        };

        $scope.removeProdutoEstudo = function(item) {
            $scope.produtosDoEstudo.splice($scope.produtosDoEstudo.indexOf(item), 1);
            $scope.iniImport();
        };


        function calculaTotalFob(produto) {
            return Number(produto.custo_usd) * produto.qtd;
        }

        function calculaTotalPeso(produto) {
            return Number(produto.medidas.peso) * produto.qtd;
        }

        function calculaCif() {
            $scope.estudo.cif = $scope.estudo.totalFob + $scope.estudo.frete_maritimo_usd + $scope.estudo.seguro;
            $scope.estudo.cif_brl = $scope.estudo.cif * $scope.estudo.cotacao_dolar;
        }

        function calculaTotalDespesas() {
            $scope.estudo.frete_maritimo_brl = $scope.estudo.frete_maritimo_usd * $scope.estudo.cotacao_dolar;
            $scope.estudo.seguro_brl = $scope.estudo.seguro_usd * $scope.estudo.cotacao_dolar;
            var aliqAfrmm = $scope.despesas.filter(function(item) {
                return item.nome === 'Taxa AFRMM'; // todo: encontrar uma forma mais confiável para buscar a alíquota.
            });
            $scope.estudo.afrmm_brl = $scope.estudo.frete_maritimo_brl * aliqAfrmm[0].aliquota; //todo: Confirmar sobre a incidência do imposto (taxa de desembarque???)
            $scope.estudo.total_despesas = $scope.estudo.afrmm_brl;
            $scope.despesas.forEach(function (item) {
                if(item.tipo === 'despesa aduaneira') {
                    if(item.moeda === 'U$') {
                        $scope.estudo.total_despesas += (item.valor * $scope.estudo.cotacao_dolar);
                    } else {
                        $scope.estudo.total_despesas += item.valor;
                    }
                }
            });
        }

        function calculaImpostosPorProduto(produto) {
            
            produto.estudo.fob = produto.custo_usd * produto.qtd;
            produto.estudo.fob_brl = produto.custo_usd * $scope.estudo.cotacao_dolar * produto.qtd;
            produto.estudo.peso = produto.medidas.peso * produto.qtd;
            produto.estudo.frete_maritimo_proporcional_brl = (produto.estudo.peso / $scope.estudo.totalPeso) * $scope.estudo.frete_maritimo_brl;
            produto.estudo.seguro_frete_maritimo_proporcional_brl = (produto.estudo.peso / $scope.estudo.totalPeso) * $scope.estudo.seguro_brl;
            produto.estudo.cif = produto.estudo.fob_brl + produto.estudo.frete_maritimo_proporcional_brl + produto.estudo.seguro_frete_maritimo_proporcional_brl;
            
            produto.estudo.ii = produto.estudo.cif * produto.impostos.ii;
            produto.estudo.ipi = (produto.estudo.cif + produto.estudo.ii) * produto.impostos.ipi;
            produto.estudo.pis = produto.estudo.cif * produto.impostos.pis;
            produto.estudo.cofins = produto.estudo.cif * produto.impostos.cofins;
            produto.estudo.icms = ((produto.estudo.cif + produto.estudo.ii + produto.estudo.ipi + produto.estudo.pis + produto.estudo.cofins) / (1 - $scope.estudo.aliq_icms)) * $scope.estudo.aliq_icms;
            produto.estudo.total_dos_tributos = (produto.estudo.ii + produto.estudo.ipi + produto.estudo.pis + produto.estudo.cofins + produto.estudo.icms);
            
            $scope.estudo.tributos.ii += produto.estudo.ii;
            $scope.estudo.tributos.ipi += produto.estudo.ipi;
            $scope.estudo.tributos.pis += produto.estudo.pis;
            $scope.estudo.tributos.cofins += produto.estudo.cofins;
            $scope.estudo.tributos.icms += produto.estudo.icms;
            $scope.estudo.tributos.total_dos_tributos += produto.estudo.total_dos_tributos;
            
        }

        function zeraDadosEstudo() {
            $scope.estudo.totalFob = 0;
            $scope.estudo.totalPeso = 0;
            $scope.estudo.tributos.ii = 0;
            $scope.estudo.tributos.ipi = 0;
            $scope.estudo.tributos.pis = 0;
            $scope.estudo.tributos.cofins = 0;
            $scope.estudo.tributos.icms = 0;
            $scope.estudo.tributos.total_dos_tributos = 0;
            $scope.estudo.cif_brl = 0;
            $scope.estudo.afrmm_brl = 0;
            $scope.estudo.total_despesas = 0;
        }

        function totalizaFobPeso() {
            $scope.produtosDoEstudo.forEach(function (produto) {
                $scope.estudo.totalFob += calculaTotalFob(produto);
                $scope.estudo.totalPeso += calculaTotalPeso(produto);
            });
        }

        function calculaImportacaoProdutos() {
            $scope.produtosDoEstudo.forEach(function (produto) {
                calculaImpostosPorProduto(produto);
            });
        }

        $scope.iniImport = function() {
            zeraDadosEstudo();
            if($scope.produtosDoEstudo.length > 0) {
                totalizaFobPeso();
                calculaCif();
                calculaTotalDespesas();
                calculaImportacaoProdutos();
            }
        }
    }
]);

