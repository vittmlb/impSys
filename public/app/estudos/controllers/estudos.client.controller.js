/**
 * Created by Vittorio on 30/05/2016.
 */
angular.module('estudos').controller('EstudosController', ['$scope', '$routeParams', '$location', 'Produtos', 'Despesas', '$http', '$stateParams', '$state',
    function($scope, $routeParams, $location, Produtos, Despesas, $http, $stateParams, $state) {

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
            volume_ocupado: 0,
            total_despesas: 0,
        };
        $scope.config = {
            cotacao_dolar: 0,
            cotacao_dolar_paypal: 0,
            volume_cntr_20: 0,
            iof_cartao: 0,
            taxa_paypal: 0
        };

        
        $scope.myValue = true;

        $scope.loadData = function() {
            $scope.produtos = Produtos.query();
            $scope.despesas = Despesas.query();
            $http.get('/app/data/config.json').success(function (data) {
                $scope.config = data;
            });
        };
        
        $scope.adicionaProdutoEstudo = function(item) {
            item.qtd = 0;
            item.percentual_paypal = 0;
            item.custo_dentro = item.custo_usd;
            item.custo_paypal = item.custo_usd * item.percentual_paypal;
            item.estudo = {};
            $scope.produtosDoEstudo.push(item);
        };

        $scope.removeProdutoEstudo = function(item) {
            $scope.produtosDoEstudo.splice($scope.produtosDoEstudo.indexOf(item), 1);
            $scope.iniImport();
        };

        $scope.calculaCustoPaypal = function(item, nomeCampo) {
            if(nomeCampo === 'percentual_paypal') {
                item.custo_paypal = item.custo_usd * item.percentual_paypal;
                item.custo_dentro = item.custo_usd - item.custo_paypal;
            } else if(nomeCampo === 'custo_paypal') {
                item.custo_dentro = item.custo_usd - item.custo_paypal;
                item.percentual_paypal = item.custo_paypal / item.custo_usd;
            } else {
                item.custo_paypal = item.custo_usd - item.custo_dentro;
                item.percentual_paypal = item.custo_paypal / item.custo_usd;
            }
            $scope.iniImport();
        };

        function calculaCif() {
            $scope.estudo.cif = $scope.estudo.totalFob + $scope.estudo.frete_maritimo_usd + $scope.estudo.seguro;
            $scope.estudo.cif_brl = $scope.estudo.cif * $scope.estudo.cotacao_dolar;
        }

        function calculaTotalDespesas() {
            $scope.estudo.cotacao_dolar = $scope.config.cotacao_dolar;
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
            
            produto.estudo.fob = produto.custo_dentro * produto.qtd;
            produto.estudo.fob_brl = produto.custo_dentro * $scope.estudo.cotacao_dolar * produto.qtd;
            produto.estudo.paypal = produto.custo_paypal * produto.qtd * $scope.config.cotacao_dolar_paypal * (1 + $scope.config.taxa_paypal + $scope.config.iof_cartao);

            produto.estudo.peso = produto.medidas.peso * produto.qtd;
            produto.estudo.volume_ocupado = produto.medidas.cbm * produto.qtd;

            produto.estudo.frete_maritimo_proporcional_brl = (produto.estudo.peso / $scope.estudo.totalPeso) * $scope.estudo.frete_maritimo_brl;
            produto.estudo.seguro_frete_maritimo_proporcional_brl = (produto.estudo.peso / $scope.estudo.totalPeso) * $scope.estudo.seguro_brl;
            produto.estudo.cif = produto.estudo.fob_brl + produto.estudo.frete_maritimo_proporcional_brl + produto.estudo.seguro_frete_maritimo_proporcional_brl;
            
            produto.estudo.ii = produto.estudo.cif * produto.impostos.ii;
            produto.estudo.ipi = (produto.estudo.cif + produto.estudo.ii) * produto.impostos.ipi;
            produto.estudo.pis = produto.estudo.cif * produto.impostos.pis;
            produto.estudo.cofins = produto.estudo.cif * produto.impostos.cofins;
            produto.estudo.icms = ((produto.estudo.cif + produto.estudo.ii + produto.estudo.ipi + produto.estudo.pis + produto.estudo.cofins) / (1 - $scope.estudo.aliq_icms)) * $scope.estudo.aliq_icms;
            produto.estudo.total_dos_tributos = (produto.estudo.ii + produto.estudo.ipi + produto.estudo.pis + produto.estudo.cofins + produto.estudo.icms);

            produto.estudo.total_despesas = (produto.estudo.cif / $scope.estudo.cif_brl) * $scope.estudo.total_despesas;

            $scope.estudo.tributos.ii += produto.estudo.ii;
            $scope.estudo.tributos.ipi += produto.estudo.ipi;
            $scope.estudo.tributos.pis += produto.estudo.pis;
            $scope.estudo.tributos.cofins += produto.estudo.cofins;
            $scope.estudo.tributos.icms += produto.estudo.icms;
            $scope.estudo.tributos.total_dos_tributos += produto.estudo.total_dos_tributos;

            produto.estudo.preco_custo_final_br = (produto.estudo.cif + produto.estudo.paypal + produto.estudo.total_dos_tributos + produto.estudo.total_despesas) / produto.qtd;
            
        }

        function zeraDadosEstudo() {
            $scope.estudo.totalFob = 0;
            $scope.estudo.totalPaypal = 0;
            $scope.estudo.totalPeso = 0;
            $scope.estudo.volume_ocupado = 0;
            $scope.estudo.tributos.ii = 0;
            $scope.estudo.tributos.ipi = 0;
            $scope.estudo.tributos.pis = 0;
            $scope.estudo.tributos.cofins = 0;
            $scope.estudo.tributos.icms = 0;
            $scope.estudo.tributos.total_dos_tributos = 0;
            $scope.estudo.cif_brl = 0;
            $scope.estudo.afrmm_brl = 0;
            $scope.estudo.total_despesas = 0;
            $scope.estudo.volume_ocupado = 0;
        }

        function totalizaFobPesoVolume() {
            $scope.produtosDoEstudo.forEach(function (produto) {
                $scope.estudo.totalFob += Number(produto.custo_dentro) * produto.qtd; // Calcula Fob
                $scope.estudo.totalPaypal += produto.custo_paypal * produto.qtd; // Calcula o total a ser enviado pelo Paypal
                $scope.estudo.totalPeso += Number(produto.medidas.peso) * produto.qtd; // Calcula peso total
                $scope.estudo.volume += produto.medidas.cbm * produto.qtd; // Calcula volume ocupado no contêiner
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
                totalizaFobPesoVolume();
                calculaCif();
                calculaTotalDespesas();
                calculaImportacaoProdutos();
            }
        }
    }
]);

