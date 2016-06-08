/**
 * Created by Vittorio on 30/05/2016.
 */
angular.module('estudos').controller('EstudosController', ['$scope', '$routeParams', '$location', 'Produtos', 'Despesas', '$http', '$window', '$stateParams', '$state',
    function($scope, $routeParams, $location, Produtos, Despesas, $http, $window, $stateParams, $state) {

        //region Controles
        $scope.$window = $window;
        $scope.open = false;
        $scope.toggleSearch = function () {
            $scope.open = !$scope.open;

            if ($scope.open) {
                $scope.$window.onclick = function (event) {
                    closeSearchWhenClickingElsewhere(event, $scope.toggleSearch);
                };
            } else {
                $scope.open = false;
                $scope.$window.onclick = null;
                $scope.$apply();
            }
        };

        function closeSearchWhenClickingElsewhere(event, callbackOnClose) {

            var clickedElement = event.target;
            if (!clickedElement) return;

            var elementClasses = clickedElement.classList;
            var clickedOnSearchDrawer = elementClasses.contains('handle-right') ||
                                        elementClasses.contains('drawer-right') ||
                                        (clickedElement.parentElement !== null);

            if (!clickedOnSearchDrawer) {
                callbackOnClose();
                return;
            }

        }
        //endregion

        $scope.quantidades = [];
        $scope.produtosDoEstudo = [];
        $scope.estudo = {
            cotacao_dolar: 0,
            cotacao_dolar_paypal: 0,
            config: {
                taxa_paypal: 0,
                iof_cartao: 0,
                comissao_ml: 0,
                aliquota_simples: 0,
                percentual_comissao_conny: 0
            },
            total_comissao_conny_usd: 0,
            total_comissao_conny_brl: 0,
            total: {
                comissao_conny: {
                    usd: 0,
                    brl: 0
                }
            },
            // fob: {
            //     declarado: {
            //         usd: 0,
            //         brl: 0
            //     },
            //     real: {
            //         usd: 0,
            //         brl: 0
            //     }
            // },
            fob_usd: 0,
            fob_brl: 0,
            fob_integral_usd: 0,
            fob_integral_brl: 0,

            cif_usd: 0,
            cif_brl: 0,
            cif_integral_usd: 0,
            cif_integral_brl: 0,
            totalPeso: 0,
            frete_maritimo_usd: 0,
            frete_maritimo_brl: 0,
            seguro_frete_maritimo: {
                usd: 0,
                brl: 0
            },
            aliq_icms: 0.16, // todo: Carregar esta informação à partir do objeto despesas.
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
            tributos_integral: {
                ii: 0,
                ipi: 0,
                pis: 0,
                cofins: 0,
                icms: 0,
                total_dos_tributos: 0
            },
            volume: {
                contratado: 0, // todo: Volume do Cntr escolhido para fazer o transporte da carga. Encontrar uma solução melhor para quando for trabalhar com outros volumes.
                ocupado: 0,
                ocupado_percentual: 0
            },
            total_despesas: 0,
            investimento_brl: 0,
            lucro_brl: 0
        };
        $scope.config = {
            cotacao_dolar: 0,
            cotacao_dolar_paypal: 0,
            volume_cntr_20: 0,
            iof_cartao: 0,
            taxa_paypal: 0,
            frete_maritimo_usd: 0,
            seguro_frete_maritimo_usd: 0,
            comissao_conny: 0
        };

        $scope.myValue = true;

        /**
         * Carrega os dados à partir do BD e arquivos para <$scope.produtos> / <$scope.despesas> / <$scope.config>
         */
        $scope.loadData = function() {
            $scope.produtos = Produtos.query();
            $scope.despesas = Despesas.query();
            $http.get('/app/data/config.json').success(function (data) {
                $scope.config = data;
            });
        };

        /**
         * Adiciona objeto <estudo_do_produto> ao objeto <produto> e depois faz um push para adicionar <produto> no array $scope.produtosDoEstudo.
         * @param produto
         */
        $scope.adicionaProdutoEstudo = function(produto) {
            produto.estudo_do_produto = {
                qtd: 0,
                percentual_paypal: 0,
                custo_dentro_usd: produto.custo_usd,
                custo_dentro_brl: 0,
                custo_paypal_usd: 0,
                custo_paypal_brl: 0,
                custo_integral_usd: produto.custo_usd,
                custo_integral_brl: 0,
                fob_usd: 0,
                fob_brl: 0,
                fob_paypal_usd: 0,
                fob_paypal_brl: 0,
                fob_integral_usd: 0,
                fob_integral_brl: 0,
                peso_total: 0,
                peso_percentual: 0, // Percentual do peso total do produto em relação ao peso de toda a carga.
                volume_ocupado: 0,
                volume_ocupado_percentual: 0, // Percentual do volume total ocupado pelo produto em relação ao volume total ocupado do contêiner.
                frete_maritimo_usd: 0,
                frete_maritimo_brl: 0,
                seguro_frete_maritimo_usd: 0,
                seguro_frete_maritimo_brl: 0,
                cif_usd: 0,
                cif_brl: 0,
                cif_integral_usd: 0,
                cif_integral_brl: 0,
                ii_usd: 0,
                ii_brl: 0,
                ii_integral_usd: 0,
                ii_integral_brl: 0,
                ipi_usd: 0,
                ipi_brl: 0,
                ipi_integral_usd: 0,
                ipi_integral_brl: 0,
                pis_usd: 0,
                pis_brl: 0,
                pis_integral_usd: 0,
                pis_integral_brl: 0,
                cofins_usd: 0,
                cofins_brl: 0,
                cofins_integral_usd: 0,
                cofins_integral_brl: 0,
                icms_usd: 0,
                icms_brl: 0,
                icms_integral_usd: 0,
                icms_integral_brl: 0,
                total_tributos_usd: 0,
                total_tributos_brl: 0,
                total_tributos_integral_usd: 0,
                total_tributos_integral_brl: 0,
                total_despesas_usd: 0,
                total_despesas_brl: 0,
                total_despesas_integral_usd: 0,
                total_despesas_integral_brl: 0,
                investimento_brl: 0,
                investimento_integral_brl: 0,
                preco_custo_final_brl: 0,
                preco_custo_final_integral_brl: 0,
                preco_venda_brl: 0,
                lucro_unitario_brl: 0,
                lucro_total_brl: 0
            };
            $scope.produtosDoEstudo.push(produto);
        };

        $scope.removeProdutoEstudo = function(item) {
            $scope.produtosDoEstudo.splice($scope.produtosDoEstudo.indexOf(item), 1);
            $scope.iniImport();
        };

        $scope.calculaCustoPaypal = function(produto, nomeCampo) {
            if(nomeCampo === 'percentual_paypal') {
                produto.estudo_do_produto.custo_paypal_usd = produto.custo_usd * produto.estudo_do_produto.percentual_paypal;
                produto.estudo_do_produto.custo_dentro_usd = produto.custo_usd - produto.estudo_do_produto.custo_paypal_usd;
            } else if(nomeCampo === 'custo_paypal') {
                produto.estudo_do_produto.custo_dentro_usd = produto.custo_usd - produto.estudo_do_produto.custo_paypal_usd;
                produto.estudo_do_produto.percentual_paypal = produto.estudo_do_produto.custo_paypal_usd / produto.custo_usd;
            } else {
                produto.estudo_do_produto.custo_paypal_usd = produto.custo_usd - produto.estudo_do_produto.custo_dentro_usd;
                produto.estudo_do_produto.percentual_paypal = produto.estudo_do_produto.custo_paypal_usd / produto.custo_usd;
            }
            $scope.iniImport();
        };

        function tempCalculaImpostos(produto) {

            // Cálculo dos Impostos - II.
            produto.estudo_do_produto.ii_usd = produto.estudo_do_produto.cif_usd * produto.impostos.ii;
            produto.estudo_do_produto.ii_brl = produto.estudo_do_produto.cif_brl * produto.impostos.ii;
            produto.estudo_do_produto.ii_integral_usd = produto.estudo_do_produto.cif_integral_usd * produto.impostos.ii;
            produto.estudo_do_produto.ii_integral_brl = produto.estudo_do_produto.cif_integral_brl * produto.impostos.ii;

            // Cálculo dos Impostos - IPI.
            produto.estudo_do_produto.ipi_usd = (produto.estudo_do_produto.cif_usd + produto.estudo_do_produto.ii_usd) * produto.impostos.ipi;
            produto.estudo_do_produto.ipi_brl = (produto.estudo_do_produto.cif_brl + produto.estudo_do_produto.ii_brl) * produto.impostos.ipi;
            produto.estudo_do_produto.ipi_integral_usd = (produto.estudo_do_produto.cif_integral_usd + produto.estudo_do_produto.ii_integral_usd) * produto.impostos.ipi;
            produto.estudo_do_produto.ipi_integral_brl = (produto.estudo_do_produto.cif_integral_brl + produto.estudo_do_produto.ii_integral_brl) * produto.impostos.ipi;

            // Cálculo dos Impostos - PIS.
            produto.estudo_do_produto.pis_usd = produto.estudo_do_produto.cif_usd * produto.impostos.pis;
            produto.estudo_do_produto.pis_brl = produto.estudo_do_produto.cif_brl * produto.impostos.pis;
            produto.estudo_do_produto.pis_integral_usd = produto.estudo_do_produto.cif_integral_usd * produto.impostos.pis;
            produto.estudo_do_produto.pis_integral_brl = produto.estudo_do_produto.cif_integral_brl * produto.impostos.pis;

            // Cálculo dos Impostos - Cofins.
            produto.estudo_do_produto.cofins_usd = produto.estudo_do_produto.cif_usd * produto.impostos.cofins;
            produto.estudo_do_produto.cofins_brl = produto.estudo_do_produto.cif_brl * produto.impostos.cofins;
            produto.estudo_do_produto.cofins_integral_usd = produto.estudo_do_produto.cif_integral_usd * produto.impostos.cofins;
            produto.estudo_do_produto.cofins_integral_brl = produto.estudo_do_produto.cif_integral_brl * produto.impostos.cofins;

            // Cálculo dos Impostos - ICMS.
            produto.estudo_do_produto.icms_usd = (((
                produto.estudo_do_produto.cif_usd +
                produto.estudo_do_produto.ii_usd +
                produto.estudo_do_produto.ipi_usd +
                produto.estudo_do_produto.pis_usd +
                produto.estudo_do_produto.cofins_usd) / (1 - $scope.estudo.aliq_icms)) * $scope.estudo.aliq_icms
            );

            produto.estudo_do_produto.icms_brl = (((
                produto.estudo_do_produto.cif_brl +
                produto.estudo_do_produto.ii_brl +
                produto.estudo_do_produto.ipi_brl +
                produto.estudo_do_produto.pis_brl +
                produto.estudo_do_produto.cofins_brl) / (1 - $scope.estudo.aliq_icms)) * $scope.estudo.aliq_icms
            );

            produto.estudo_do_produto.icms_integral_usd = (((
                produto.estudo_do_produto.cif_integral_usd +
                produto.estudo_do_produto.ii_integral_usd +
                produto.estudo_do_produto.ipi_integral_usd +
                produto.estudo_do_produto.pis_integral_usd +
                produto.estudo_do_produto.cofins_integral_usd) / (1 - $scope.estudo.aliq_icms)) * $scope.estudo.aliq_icms
            );

            produto.estudo_do_produto.icms_integral_brl = (((
                produto.estudo_do_produto.cif_integral_brl +
                produto.estudo_do_produto.ii_integral_brl +
                produto.estudo_do_produto.ipi_integral_brl +
                produto.estudo_do_produto.pis_integral_brl +
                produto.estudo_do_produto.cofins_integral_brl) / (1 - $scope.estudo.aliq_icms)) * $scope.estudo.aliq_icms
            );

            // Cálculo do total de tributos.
            produto.estudo_do_produto.total_tributos_usd = (
                produto.estudo_do_produto.ii_usd +
                produto.estudo_do_produto.ipi_usd +
                produto.estudo_do_produto.pis_usd +
                produto.estudo_do_produto.cofins_usd +
                produto.estudo_do_produto.icms_usd
            );

            produto.estudo_do_produto.total_tributos_brl = (
                produto.estudo_do_produto.ii_brl +
                produto.estudo_do_produto.ipi_brl +
                produto.estudo_do_produto.pis_brl +
                produto.estudo_do_produto.cofins_brl +
                produto.estudo_do_produto.icms_brl
            );

            produto.estudo_do_produto.total_tributos_integral_usd = (
                produto.estudo_do_produto.ii_integral_usd +
                produto.estudo_do_produto.ipi_integral_usd +
                produto.estudo_do_produto.pis_integral_usd +
                produto.estudo_do_produto.cofins_integral_usd +
                produto.estudo_do_produto.icms_integral_usd
            );

            produto.estudo_do_produto.total_tributos_integral_brl = (
                produto.estudo_do_produto.ii_integral_brl +
                produto.estudo_do_produto.ipi_integral_brl +
                produto.estudo_do_produto.pis_integral_brl +
                produto.estudo_do_produto.cofins_integral_brl +
                produto.estudo_do_produto.icms_integral_brl
            );

        }

        function tempUpdateImpostosEstudo(produto) {

            // Update (soma) dos valores dos impostos ao Estudo Geral.
            $scope.estudo.tributos.ii += produto.estudo_do_produto.ii_brl;
            $scope.estudo.tributos.ipi += produto.estudo_do_produto.ipi_brl;
            $scope.estudo.tributos.pis += produto.estudo_do_produto.pis_brl;
            $scope.estudo.tributos.cofins += produto.estudo_do_produto.cofins_brl;
            $scope.estudo.tributos.icms += produto.estudo_do_produto.icms_brl;
            $scope.estudo.tributos.total_dos_tributos += produto.estudo_do_produto.total_tributos_brl;

            $scope.estudo.tributos_integral.ii += produto.estudo_do_produto.ii_integral_brl;
            $scope.estudo.tributos_integral.ipi += produto.estudo_do_produto.ipi_integral_brl;
            $scope.estudo.tributos_integral.pis += produto.estudo_do_produto.pis_integral_brl;
            $scope.estudo.tributos_integral.cofins += produto.estudo_do_produto.cofins_integral_brl;
            $scope.estudo.tributos_integral.icms += produto.estudo_do_produto.icms_integral_brl;
            $scope.estudo.tributos_integral.total_dos_tributos += produto.estudo_do_produto.total_tributos_integral_brl;

        }

        function calculaResultadosPorProduto(produto) {
            produto.estudo_do_produto.lucro_unitario_brl = (produto.estudo_do_produto.preco_venda_brl * (1 - $scope.estudo.config.aliquota_simples - $scope.estudo.config.comissao_ml)) - produto.estudo_do_produto.preco_custo_final_brl;
            produto.estudo_do_produto.lucro_total_brl = produto.estudo_do_produto.lucro_unitario_brl * produto.estudo_do_produto.qtd;
        }


        /**
         * Zera os campos totalizadores do objeto <produto.estudo_do_produto>.
         * Quando um produto tem sua quantidade reduzida para 0 em um estudo, estes totalizadores são zerados
         * para não interferirem no somatório do Estudo Geral.
         * @param produto
         */
        function zeraDadosEstudoDoProduto(produto) {
            produto.estudo_do_produto = {
                qtd: 0,
                percentual_paypal: produto.estudo_do_produto.percentual_paypal,
                custo_dentro_usd: produto.estudo_do_produto.custo_dentro_usd,
                custo_dentro_brl: produto.estudo_do_produto.custo_dentro_brl,
                custo_paypal_usd: produto.estudo_do_produto.custo_paypal_usd,
                custo_paypal_brl: produto.estudo_do_produto.custo_paypal_brl,
                custo_integral_usd: produto.estudo_do_produto.custo_integral_usd,
                custo_integral_brl: produto.estudo.custo_integral_brl,
                fob_usd: 0,
                fob_brl: 0,
                fob_paypal_usd: 0,
                fob_paypal_brl: 0,
                fob_integral_usd: 0,
                fob_integral_brl: 0,
                peso_total: 0,
                peso_percentual: 0, // Percentual do peso total do produto em relação ao peso de toda a carga.
                volume_ocupado: 0,
                volume_ocupado_percentual: 0, // Percentual do volume total ocupado pelo produto em relação ao volume total ocupado do contêiner.
                frete_maritimo_usd: 0,
                frete_maritimo_brl: 0,
                seguro_frete_maritimo_usd: 0,
                seguro_frete_maritimo_brl: 0,
                cif_usd: 0,
                cif_brl: 0,
                cif_integral_usd: 0,
                cif_integral_brl: 0,
                ii_usd: 0,
                ii_brl: 0,
                ii_integral_usd: 0,
                ii_integral_brl: 0,
                ipi_usd: 0,
                ipi_brl: 0,
                ipi_integral_usd: 0,
                ipi_integral_brl: 0,
                pis_usd: 0,
                pis_brl: 0,
                pis_integral_usd: 0,
                pis_integral_brl: 0,
                cofins_usd: 0,
                cofins_brl: 0,
                cofins_integral_usd: 0,
                cofins_integral_brl: 0,
                icms_usd: 0,
                icms_brl: 0,
                icms_integral_usd: 0,
                icms_integral_brl: 0,
                total_tributos_usd: 0,
                total_tributos_brl: 0,
                total_tributos_integral_usd: 0,
                total_tributos_integral_brl: 0,
                total_despesas_usd: 0,
                total_despesas_brl: 0,
                total_despesas_integral_usd: 0,
                total_despesas_integral_brl: 0,
                investimento_brl: 0,
                investimento_integral_brl: 0,
                preco_custo_final_brl: 0,
                preco_custo_final_integral_brl: 0,
                preco_venda_brl: 0,
                lucro_unitario_brl: 0,
                lucro_total_brl: 0
            };
        }

        //region Etapas para cálculo do estudo - iniImp()
        // 1
        /**
         * Zera os valores de todos os acumuladores do objeto <$scope.estudo>
         */
        function zeraDadosEstudo() {
            $scope.estudo.fob_usd = 0;
            $scope.estudo.fob_brl = 0;
            $scope.estudo.fob_integral_usd = 0;
            $scope.estudo.fob_integral_brl = 0;
            $scope.estudo.cif_usd = 0;
            $scope.estudo.cif_brl = 0;
            $scope.estudo.cif_integral_usd = 0;
            $scope.estudo.cif_integral_brl = 0;
            $scope.estudo.totalPaypal = 0;
            $scope.estudo.totalPeso = 0;
            $scope.estudo.volume_ocupado = 0;
            $scope.estudo.tributos.ii = 0;
            $scope.estudo.tributos.ipi = 0;
            $scope.estudo.tributos.pis = 0;
            $scope.estudo.tributos.cofins = 0;
            $scope.estudo.tributos.icms = 0;
            $scope.estudo.tributos.total_dos_tributos = 0;
            $scope.estudo.tributos_integral.ii = 0;
            $scope.estudo.tributos_integral.ipi = 0;
            $scope.estudo.tributos_integral.pis = 0;
            $scope.estudo.tributos_integral.cofins = 0;
            $scope.estudo.tributos_integral.icms = 0;
            $scope.estudo.tributos._integraltotal_dos_tributos = 0;
            $scope.estudo.afrmm_brl = 0;
            $scope.estudo.total_despesas = 0;

            $scope.estudo.volume = {contratado: 0, ocupado: 0, ocupado_percentual: 0};

            $scope.estudo.investimento_brl = 0;
            $scope.estudo.investimento_integral_brl = 0;
            $scope.estudo.lucro_brl = 0;
        }

        // 2
        /**
         * Carrega o objeto <$scope.estudo> com os dados do <$scope.config>
         */
        function loadEstudoComDadosConfig() {

            $scope.estudo.cotacao_dolar = Number($scope.config.cotacao_dolar);
            $scope.estudo.cotacao_dolar_paypal = Number($scope.config.cotacao_dolar_paypal);

            $scope.estudo.frete_maritimo_usd = Number($scope.config.frete_maritimo_usd);
            $scope.estudo.frete_maritimo_brl = Number($scope.estudo.frete_maritimo_usd * $scope.estudo.cotacao_dolar);

            $scope.estudo.config.taxa_paypal = Number($scope.config.taxa_paypal);
            $scope.estudo.config.iof_cartao = Number($scope.config.iof_cartao);
            $scope.estudo.config.comissao_ml = Number($scope.config.comissao_ml);
            $scope.estudo.config.aliquota_simples = Number($scope.config.aliquota_simples);

            $scope.estudo.seguro_frete_maritimo.usd = Number($scope.config.seguro_frete_maritimo_usd);
            $scope.estudo.seguro_frete_maritimo.brl = $scope.estudo.seguro_frete_maritimo.usd * $scope.estudo.cotacao_dolar;

            $scope.estudo.volume.contratado = Number($scope.config.volume_cntr_20);

            $scope.estudo.config.percentual_comissao_conny = Number($scope.config.percentual_comissao_conny);

        }

        // 3
        /**
         * Itera por cada produto e seta os valores FOB (e variáveis usd/brl/paypal/integral) <produto.estudo_do_produto.fob...>
         */
        function setFobProdutos() {

            $scope.produtosDoEstudo.forEach(function (produto) {

                if (produto.estudo_do_produto.qtd <= 0) {
                    zeraDadosEstudoDoProduto(produto); // Zera os campos totalizadores do objeto <produto.estudo_do_produto>.
                }
                else
                {
                    produto.estudo_do_produto.fob_usd = produto.estudo_do_produto.custo_dentro_usd * produto.estudo_do_produto.qtd;
                    produto.estudo_do_produto.fob_brl = produto.estudo_do_produto.custo_dentro_usd * $scope.estudo.cotacao_dolar * produto.estudo_do_produto.qtd;

                    produto.estudo_do_produto.fob_paypal_usd = produto.estudo_do_produto.custo_paypal_usd * produto.estudo_do_produto.qtd * (1 + $scope.estudo.config.taxa_paypal + $scope.estudo.config.iof_cartao);
                    produto.estudo_do_produto.fob_paypal_brl = produto.estudo_do_produto.fob_paypal_usd * $scope.estudo.cotacao_dolar_paypal;

                    produto.estudo_do_produto.fob_integral_usd = produto.estudo_do_produto.custo_integral_usd * produto.estudo_do_produto.qtd;
                    produto.estudo_do_produto.fob_integral_brl = produto.estudo_do_produto.fob_integral_usd * $scope.estudo.cotacao_dolar;
                }

            });

        }

        // 4
        /**
         * Itera produtos para totalizar dados do <$scope.estudo> como FOBs, Peso e Volume.
         */
        function totalizaDadosBasicosDoEstudo() {

            $scope.produtosDoEstudo.forEach(function (produto) {

                if(produto.estudo_do_produto.qtd <= 0) {
                    zeraDadosEstudoDoProduto(produto);
                }
                else
                {
                    $scope.estudo.fob_usd += produto.estudo_do_produto.custo_dentro_usd * produto.estudo_do_produto.qtd; // Calcula Fob
                    $scope.estudo.fob_brl += $scope.estudo.fob_usd * $scope.estudo.cotacao_dolar;

                    $scope.estudo.fob_integral_usd += produto.estudo_do_produto.custo_integral_usd * produto.estudo_do_produto.qtd;
                    $scope.estudo.fob_integral_brl += $scope.estudo.fob_integral_usd * $scope.estudo.cotacao_dolar;

                    $scope.estudo.totalPaypal += produto.estudo_do_produto.custo_paypal_usd * produto.estudo_do_produto.qtd; // todo: Ajustar a nomenclatura (totalPaypal não está em acordo com os demais nomes que usam '_').

                    $scope.estudo.totalPeso += produto.medidas.peso * produto.estudo_do_produto.qtd; // Calcula peso total
                    $scope.estudo.volume.ocupado += produto.medidas.cbm * produto.estudo_do_produto.qtd; // Calcula volume ocupado no contêiner
                    $scope.estudo.volume.ocupado_percentual = ($scope.estudo.volume.ocupado / $scope.estudo.volume.contratado) * 100; // todo: Ajustar o controle para exibir o percentual correto pois aqui estou tendo que multiplicar por 100.
                    
                }

            });
        }

        // 5
        /**
         * Seta os Valores CIF (usd/brl/integral) do objeto <$scope.estudo>
         */
        function setCifEstudo() {
            $scope.estudo.cif_usd = $scope.estudo.fob_usd + $scope.estudo.frete_maritimo_usd + $scope.estudo.seguro_frete_maritimo.usd;
            $scope.estudo.cif_brl = $scope.estudo.cif_usd * $scope.estudo.cotacao_dolar;
            $scope.estudo.cif_integral_usd = $scope.estudo.fob_integral_usd + $scope.estudo.frete_maritimo_usd + $scope.estudo.seguro_frete_maritimo.usd;
            $scope.estudo.cif_integral_brl = $scope.estudo.cif_integral_usd * $scope.estudo.cotacao_dolar;
        }

        // 6
        /**
         * Itera pelo objeto <$scope.despesas> e faz o somatório para adicionar ao <$scope.estudo>
         */
        function totalizaDespesasDoEstudo() {

            var aliqAfrmm = $scope.despesas.filter(function(item) {
                return item.nome === 'Taxa AFRMM'; // todo: Criar mecanismo de Erro quando não encontrar a taxa.
            });
            $scope.estudo.afrmm_brl = $scope.estudo.frete_maritimo_brl * aliqAfrmm[0].aliquota; //todo: Confirmar sobre a incidência do imposto (taxa de desembarque???)
            $scope.estudo.total_despesas = $scope.estudo.afrmm_brl; // Ao invés de iniciar as despesas com zero, já inicializo com o afrmm.
            $scope.despesas.forEach(function (item) {
                if(item.tipo === 'despesa aduaneira' && item.ativa === true) {
                    if(item.moeda === 'U$') {
                        $scope.estudo.total_despesas += (item.valor * $scope.estudo.cotacao_dolar);
                    } else {
                        $scope.estudo.total_despesas += item.valor;
                    }
                }
            });

        }

        // 7
        /**
         * Itera por cada produto de <$scope.ProdutosDoEstudo> para gerar um <estudo_do_produto> com os custos de importação individualizados e totalizar <$scope.estudo>.
         */
        function geraEstudoDeCadaProduto() {

            $scope.produtosDoEstudo.forEach(function (produto) {

                // Garante que o estudo somente seja realizado caso o produto iterado tenha quantidade maior que zero (problema de divisão por zero)
                if(produto.estudo_do_produto.qtd <= 0) {
                    zeraDadosEstudoDoProduto(produto);
                }
                else
                {
                    auxCalculaMedidasDeCadaProduto(produto);

                    // Cálculo de Frete Marítimo proporcional.
                    produto.estudo_do_produto.frete_maritimo_usd = produto.estudo_do_produto.peso_percentual * $scope.estudo.frete_maritimo_usd;
                    produto.estudo_do_produto.frete_maritimo_brl = produto.estudo_do_produto.frete_maritimo_usd * $scope.estudo.cotacao_dolar;

                    // Cálculo de Seguro de Frete Marítimo proporcional.
                    produto.estudo_do_produto.seguro_frete_maritimo_usd = produto.estudo_do_produto.peso_percentual * $scope.estudo.seguro_frete_maritimo.usd;
                    produto.estudo_do_produto.seguro_frete_maritimo_brl = produto.estudo_do_produto.seguro_frete_maritimo_usd * $scope.estudo.cotacao_dolar;

                    // produto.estudo.cif = produto.estudo.fob_brl + produto.estudo.frete_maritimo_proporcional_brl + produto.estudo.seguro_frete_maritimo_proporcional_brl;

                    // Cálculo CIFs (que é o mesmo que Valor Aduaneiro).
                    produto.estudo_do_produto.cif_usd = produto.estudo_do_produto.fob_usd + produto.estudo_do_produto.frete_maritimo_usd + produto.estudo_do_produto.seguro_frete_maritimo_usd;
                    produto.estudo_do_produto.cif_brl = produto.estudo_do_produto.cif_usd * $scope.estudo.cotacao_dolar;
                    produto.estudo_do_produto.cif_integral_usd = produto.estudo_do_produto.fob_integral_usd + produto.estudo_do_produto.frete_maritimo_usd + produto.estudo_do_produto.seguro_frete_maritimo_usd;
                    produto.estudo_do_produto.cif_integral_brl = produto.estudo_do_produto.cif_integral_usd * $scope.estudo.cotacao_dolar;

                    tempCalculaImpostos(produto);

                    // Cálculo do total de despesas proporcional do produto.
                    produto.estudo_do_produto.total_despesas_brl = (produto.estudo_do_produto.cif_brl / $scope.estudo.cif_brl) * $scope.estudo.total_despesas;
                    produto.estudo_do_produto.total_despesas_usd = produto.estudo_do_produto.total_despesas_brl / $scope.estudo.cotacao_dolar; // todo: Definir se esta é a melhor forma de calcular este valor.
                    produto.estudo_do_produto.total_despesas_integral_brl = (produto.estudo_do_produto.cif_integral_brl / $scope.estudo.cif_integral_brl) * $scope.estudo.total_despesas;
                    produto.estudo_do_produto.total_despesas_integral_usd = produto.estudo_do_produto.total_despesas_integral_brl / $scope.estudo.cotacao_dolar; // todo: Definir se esta é a melhor forma de calcular este valor.


                    tempUpdateImpostosEstudo(produto);


                    // Cálculo do Investimento (total) a ser feito no produto.
                    produto.estudo_do_produto.investimento_brl = (
                        produto.estudo_do_produto.cif_brl +
                        produto.estudo_do_produto.fob_paypal_brl + // já considerando a taxa paypal e o IOF sobre compras internacionais do cartão
                        produto.estudo_do_produto.total_tributos_brl +
                        produto.estudo_do_produto.total_despesas_brl
                    );

                    produto.estudo_do_produto.investimento_integral_brl = (
                        produto.estudo_do_produto.cif_integral_brl +
                        produto.estudo_do_produto.total_tributos_integral_brl +
                        produto.estudo_do_produto.total_despesas_integral_brl
                    );

                    // Update (soma) do total de investimento do Estudo Geral.
                    $scope.estudo.investimento_brl += produto.estudo_do_produto.investimento_brl;
                    $scope.estudo.investimento_integral_brl += produto.estudo_do_produto.investimento_integral_brl;

                    // Cálculo do preço de Custo final do produto.
                    produto.estudo_do_produto.preco_custo_final_brl = produto.estudo_do_produto.investimento_brl / produto.estudo_do_produto.qtd;
                    produto.estudo_do_produto.preco_custo_final_integral_brl = produto.estudo_do_produto.investimento_integral_brl / produto.estudo_do_produto.qtd;

                    // Calcula o resultado unitário e total de cada um dos produtos.
                    calculaResultadosPorProduto(produto);

                    // Update (soma) dos lucros dos produtos para formar o Lucro Total do Estudo.
                    $scope.estudo.lucro_brl += produto.estudo_do_produto.lucro_total_brl;
                }

            });

        }

        function auxCalculaMedidasDeCadaProduto(produto) {

            if(produto.estudo_do_produto <= 0) {
                zeraDadosEstudoDoProduto(produto);
            }
            else
            {
                // Cálculo das medidas > Peso e Volume totais do produto.
                produto.estudo_do_produto.peso_total = produto.medidas.peso * produto.estudo_do_produto.qtd;
                produto.estudo_do_produto.volume_ocupado = produto.medidas.cbm * produto.estudo_do_produto.qtd;

                // Cálculo dos percentuais > Peso e Volume proporcionais do produto
                produto.estudo_do_produto.peso_percentual = produto.estudo_do_produto.peso_total / $scope.estudo.totalPeso;
                produto.estudo_do_produto.volume_ocupado_percentual = produto.estudo_do_produto.volume_ocupado / $scope.estudo.volume_ocupado;
            }

        }


        $scope.iniImport = function() {
            zeraDadosEstudo();
            loadEstudoComDadosConfig();
            if($scope.produtosDoEstudo.length > 0)
            {
                setFobProdutos(); // Itera por cada produto e seta os valores FOB (e variáveis usd/brl/paypal/integral) <produto.estudo_do_produto.fob...>
                totalizaDadosBasicosDoEstudo(); // Itera produtos para totalizar dados do <$scope.estudo> como FOBs, Peso e Volume.
                setCifEstudo(); // Seta os Valores CIF (usd/brl/integral) do objeto <$scope.estudo>
                totalizaDespesasDoEstudo(); // Itera pelo objeto <$scope.despesas> e faz o somatório para adicionar ao <$scope.estudo>
                geraEstudoDeCadaProduto(); // Itera por cada produto de <$scope.ProdutosDoEstudo> para gerar um <estudo_do_produto> com os custos de importação individualizados e totalizar <$scope.estudo>.
            }
        };


        //endregion

        $scope.comparaDados = function() {

        };

    }
]);

