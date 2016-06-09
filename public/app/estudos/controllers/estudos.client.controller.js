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
            fob: {
                declarado: {
                    usd: 0,
                    brl: 0
                },
                real: {
                    usd: 0,
                    brl: 0
                }
            },
            cif: {
                declarado: {
                    usd: 0,
                    brl: 0
                },
                real: {
                    usd: 0,
                    brl: 0
                }
            },
            frete_maritimo: {
                valor: {
                    usd: 0,
                    brl: 0
                },
                seguro: {
                    usd: 0,
                    brl: 0
                }
            },
            medidas: {
                peso: {
                    contratado: 0, // Por enquanto não vou usar esse valor > Só será usado quando importar um produto muito pesado.
                    ocupado: 0,
                    ocupado_percentual: 0 // Por enquanto não vou usar esse valor > Só será usado quando importar um produto muito pesado.
                },
                volume: {
                    contratado: 0, // todo: Volume do Cntr escolhido para fazer o transporte da carga. Encontrar uma solução melhor para quando for trabalhar com outros volumes.
                    ocupado: 0,
                    ocupado_percentual: 0
                }
            },
            aliq_icms: 0.16, // todo: Carregar esta informação à partir do objeto despesas.
            tributos: {
                delarado: {
                    ii: {
                        usd: 0,
                        brl: 0
                    },
                    ipi: {
                        usd: 0,
                        brl: 0
                    },
                    pis: {
                        usd: 0,
                        brl: 0
                    },
                    cofins: {
                        usd: 0,
                        brl: 0
                    },
                    icms: {
                        usd: 0,
                        brl: 0
                    },
                    total: {
                        usd: 0,
                        brl: 0
                    }
                },
                real: {
                    ii: {
                        usd: 0,
                        brl: 0
                    },
                    ipi: {
                        usd: 0,
                        brl: 0
                    },
                    pis: {
                        usd: 0,
                        brl: 0
                    },
                    cofins: {
                        usd: 0,
                        brl: 0
                    },
                    icms: {
                        usd: 0,
                        brl: 0
                    },
                    total: {
                        usd: 0,
                        brl: 0
                    }
                }
            },
            despesas: {
                afrmm: {
                    usd: 0,
                    brl: 0
                }, // todo: Não tem qualquer utilidade. Serve apenas para comparar se os cálculos estão corretos. Encontrar nova forma de fazer isso e elimitar isso daqui.
                total: {
                    usd: 0,
                    brl: 0
                }
            },


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
        $scope.adicionaProdutoEstudo = function(produto) { // todo: Renomear > Este nome não faz o menor sentido !!!!
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
                cif: {
                    declarado: {
                        usd: 0,
                        brl: 0
                    },
                    real: {
                        usd: 0,
                        brl: 0
                    }
                },

                // cif_usd: 0,
                // cif_brl: 0,
                // cif_integral_usd: 0,
                // cif_integral_brl: 0,
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

            $scope.estudo.tributos.declarado.ii.brl += produto.estudo_do_produto.ii_brl;
            $scope.estudo.tributos.declarado.ipi.brl += produto.estudo_do_produto.ipi_brl;
            $scope.estudo.tributos.declarado.pis.brl += produto.estudo_do_produto.pis_brl;
            $scope.estudo.tributos.declarado.cofins.brl += produto.estudo_do_produto.cofins_brl;
            $scope.estudo.tributos.declarado.icms.brl += produto.estudo_do_produto.icms_brl;
            $scope.estudo.tributos.declarado.total.brl += produto.estudo_do_produto.total_tributos_brl;

            $scope.estudo.tributos.real.ii.brl += produto.estudo_do_produto.ii_integral_brl;
            $scope.estudo.tributos.real.ipi.brl += produto.estudo_do_produto.ipi_integral_brl;
            $scope.estudo.tributos.real.pis.brl += produto.estudo_do_produto.pis_integral_brl;
            $scope.estudo.tributos.real.cofins.brl += produto.estudo_do_produto.cofins_integral_brl;
            $scope.estudo.tributos.real.icms.brl += produto.estudo_do_produto.icms_integral_brl;
            $scope.estudo.tributos.real.total.brl += produto.estudo_do_produto.total_tributos_integral_brl;

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

            $scope.estudo.fob = {declarado: {usd: 0, brl: 0}, real: {usd: 0, brl: 0}};
            $scope.estudo.cif = {declarado: {usd: 0, brl: 0}, real: {usd: 0, brl: 0}};

            $scope.estudo.totalPaypal = 0;
            $scope.estudo.totalPeso = 0;
            $scope.estudo.volume_ocupado = 0;

            $scope.estudo.tributos.declarado = {ii: {usd: 0, brl: 0}, ipi: {usd: 0, brl: 0}, pis: {usd: 0, brl: 0}, cofins: {usd: 0, brl: 0}, icms: {usd: 0, brl: 0}, total: {usd: 0, brl: 0}};
            $scope.estudo.tributos.real = {ii: {usd: 0, brl: 0}, ipi: {usd: 0, brl: 0}, pis: {usd: 0, brl: 0}, cofins: {usd: 0, brl: 0}, icms: {usd: 0, brl: 0}, total: {usd: 0, brl: 0}};

            $scope.estudo.despesas.total.brl = 0;
            $scope.estudo.despesas.afrmm.brl = 0;

            // $scope.estudo.afrmm_brl = 0;
            // $scope.estudo.total_despesas = 0;

            $scope.estudo.medidas.peso = {contratado: 0, ocupado: 0, ocupado_percentual: 0};
            $scope.estudo.medidas.volume = {contratado: 0, ocupado: 0, ocupado_percentual: 0};

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

            $scope.estudo.frete_maritimo.valor.usd = Number($scope.config.frete_maritimo_usd);
            $scope.estudo.frete_maritimo.valor.brl = Number($scope.estudo.frete_maritimo.valor.usd * $scope.estudo.cotacao_dolar);

            $scope.estudo.config.taxa_paypal = Number($scope.config.taxa_paypal);
            $scope.estudo.config.iof_cartao = Number($scope.config.iof_cartao);
            $scope.estudo.config.comissao_ml = Number($scope.config.comissao_ml);
            $scope.estudo.config.aliquota_simples = Number($scope.config.aliquota_simples);

            $scope.estudo.frete_maritimo.seguro.usd = Number($scope.config.seguro_frete_maritimo_usd);
            $scope.estudo.frete_maritimo.seguro.brl = $scope.estudo.frete_maritimo.seguro.usd * $scope.estudo.cotacao_dolar;

            $scope.estudo.medidas.volume.contratado = Number($scope.config.volume_cntr_20);

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

                    $scope.estudo.fob.declarado.usd += produto.estudo_do_produto.custo_dentro_usd * produto.estudo_do_produto.qtd; // Calcula Fob
                    $scope.estudo.fob.declarado.brl += $scope.estudo.fob.declarado.usd * $scope.estudo.cotacao_dolar;

                    $scope.estudo.fob.real.usd += produto.estudo_do_produto.custo_integral_usd * produto.estudo_do_produto.qtd;
                    $scope.estudo.fob.real.brl += $scope.estudo.fob.real.usd * $scope.estudo.cotacao_dolar;

                    $scope.estudo.totalPaypal += produto.estudo_do_produto.custo_paypal_usd * produto.estudo_do_produto.qtd; // todo: Ajustar a nomenclatura (totalPaypal não está em acordo com os demais nomes que usam '_').

                    $scope.estudo.medidas.peso.ocupado += produto.medidas.peso * produto.estudo_do_produto.qtd; // Calcula peso total
                    $scope.estudo.medidas.volume.ocupado += produto.medidas.cbm * produto.estudo_do_produto.qtd; // Calcula volume ocupado no contêiner
                    $scope.estudo.medidas.volume.ocupado_percentual = ($scope.estudo.medidas.volume.ocupado / $scope.estudo.medidas.volume.contratado) * 100; // todo: Ajustar o controle para exibir o percentual correto pois aqui estou tendo que multiplicar por 100.
                    
                }

            });
        }

        // 5
        /**
         * Seta os Valores CIF (usd/brl/integral) do objeto <$scope.estudo>
         */
        function setCifEstudo() {

            $scope.estudo.cif.declarado.usd = $scope.estudo.fob.declarado.usd + $scope.estudo.frete_maritimo.valor.usd + $scope.estudo.frete_maritimo.seguro.usd;
            $scope.estudo.cif.declarado.brl = $scope.estudo.cif.declarado.usd * $scope.estudo.cotacao_dolar;

            $scope.estudo.cif.real.usd = $scope.estudo.fob.real.usd + $scope.estudo.frete_maritimo.valor.usd + $scope.estudo.frete_maritimo.seguro.usd;
            $scope.estudo.cif.real.brl = $scope.estudo.cif.real.usd * $scope.estudo.cotacao_dolar;

        }

        // 6
        /**
         * Itera pelo objeto <$scope.despesas> e faz o somatório para adicionar ao <$scope.estudo>
         */
        function totalizaDespesasDoEstudo() {

            var aliqAfrmm = $scope.despesas.filter(function(item) {
                return item.nome === 'Taxa AFRMM'; // todo: Criar mecanismo de Erro quando não encontrar a taxa.
            });
            $scope.estudo.despesas.afrmm.brl = $scope.estudo.frete_maritimo.valor.brl * aliqAfrmm[0].aliquota; //todo: Confirmar sobre a incidência do imposto (taxa de desembarque???)
            $scope.estudo.despesas.total.brl = $scope.estudo.despesas.afrmm.brl; // Ao invés de iniciar as despesas com zero, já inicializo com o afrmm.
            $scope.despesas.forEach(function (item) {
                if(item.tipo === 'despesa aduaneira' && item.ativa === true) {
                    if(item.moeda === 'U$') {
                        $scope.estudo.despesas.total.brl += (item.valor * $scope.estudo.cotacao_dolar);
                    } else {
                        $scope.estudo.despesas.total.brl += item.valor;
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
                    produto.estudo_do_produto.frete_maritimo_usd = produto.estudo_do_produto.peso_percentual * $scope.estudo.frete_maritimo.valor.usd;
                    produto.estudo_do_produto.frete_maritimo_brl = produto.estudo_do_produto.frete_maritimo_usd * $scope.estudo.cotacao_dolar;

                    // Cálculo de SEGURO de Frete Marítimo proporcional.
                    produto.estudo_do_produto.seguro_frete_maritimo_usd = produto.estudo_do_produto.peso_percentual * $scope.estudo.frete_maritimo.seguro.usd;
                    produto.estudo_do_produto.seguro_frete_maritimo_brl = produto.estudo_do_produto.seguro_frete_maritimo_usd * $scope.estudo.cotacao_dolar;

                    // Cálculo CIFs (que é o mesmo que Valor Aduaneiro).
                    produto.estudo_do_produto.cif_usd = produto.estudo_do_produto.fob_usd + produto.estudo_do_produto.frete_maritimo_usd + produto.estudo_do_produto.seguro_frete_maritimo_usd;
                    produto.estudo_do_produto.cif_brl = produto.estudo_do_produto.cif_usd * $scope.estudo.cotacao_dolar;
                    produto.estudo_do_produto.cif_integral_usd = produto.estudo_do_produto.fob_integral_usd + produto.estudo_do_produto.frete_maritimo_usd + produto.estudo_do_produto.seguro_frete_maritimo_usd;
                    produto.estudo_do_produto.cif_integral_brl = produto.estudo_do_produto.cif_integral_usd * $scope.estudo.cotacao_dolar;

                    tempCalculaImpostos(produto);

                    // Cálculo do total de despesas proporcional do produto.
                    produto.estudo_do_produto.total_despesas_brl = (produto.estudo_do_produto.cif_brl / $scope.estudo.cif.declarado.brl) * $scope.estudo.despesas.total.brl;
                    produto.estudo_do_produto.total_despesas_usd = produto.estudo_do_produto.total_despesas_brl / $scope.estudo.cotacao_dolar; // todo: Definir se esta é a melhor forma de calcular este valor.
                    produto.estudo_do_produto.total_despesas_integral_brl = (produto.estudo_do_produto.cif_integral_brl / $scope.estudo.cif.real.brl) * $scope.estudo.despesas.total.brl;

                    // todo: URGENTE !!! Criar mecanismo para impedir divisões por zero.
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
                produto.estudo_do_produto.peso_percentual = produto.estudo_do_produto.peso_total / $scope.estudo.medidas.peso.ocupado;
                produto.estudo_do_produto.volume_ocupado_percentual = produto.estudo_do_produto.volume_ocupado / $scope.estudo.medidas.volume.ocupado;
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

