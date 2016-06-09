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
                declarado: {
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
                custo_unitario: {
                    declarado: {
                        usd: produto.custo_usd,
                        brl: 0
                    },
                    paypal: {
                        usd: 0,
                        brl: 0
                    },
                    real: {
                        usd: produto.custo_usd,
                        brl: 0
                    }
                },
                percentual_paypal: 0,
                fob: {
                    declarado: {
                        usd: 0,
                        brl: 0
                    },
                    real: {
                        usd: 0,
                        brl: 0
                    },
                    paypal: {
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
                tributos: {
                    declarado: {
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
                    total: {
                        usd: 0,
                        brl: 0
                    }
                },
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
                produto.estudo_do_produto.custo_unitario.paypal.usd = produto.custo_usd * produto.estudo_do_produto.percentual_paypal;
                produto.estudo_do_produto.custo_unitario.declarado.usd = produto.custo_usd - produto.estudo_do_produto.custo_unitario.paypal.usd;
            } else if(nomeCampo === 'custo_paypal') {
                produto.estudo_do_produto.custo_unitario.declarado.usd = produto.custo_usd - produto.estudo_do_produto.custo_unitario.paypal.usd;
                produto.estudo_do_produto.percentual_paypal = produto.estudo_do_produto.custo_unitario.paypal.usd / produto.custo_usd;
            } else {
                produto.estudo_do_produto.custo_unitario.paypal.usd = produto.custo_usd - produto.estudo_do_produto.custo_unitario.declarado.usd;
                produto.estudo_do_produto.percentual_paypal = produto.estudo_do_produto.custo_unitario.paypal.usd / produto.custo_usd;
            }
            $scope.iniImport();
        };

        function tempCalculaImpostos(produto) {

            // Cálculo dos Impostos - II.
            produto.estudo_do_produto.tributos.declarado.ii.usd = produto.estudo_do_produto.cif.declarado.usd * produto.impostos.ii;
            produto.estudo_do_produto.tributos.declarado.ii.brl = produto.estudo_do_produto.cif.declarado.brl * produto.impostos.ii;
            produto.estudo_do_produto.tributos.real.ii.usd = produto.estudo_do_produto.cif.real.usd * produto.impostos.ii;
            produto.estudo_do_produto.tributos.real.ii.brl = produto.estudo_do_produto.cif.real.brl * produto.impostos.ii;

            // Cálculo dos Impostos - IPI.
            produto.estudo_do_produto.tributos.declarado.ipi.usd = (produto.estudo_do_produto.cif.declarado.usd + produto.estudo_do_produto.tributos.declarado.ii.usd) * produto.impostos.ipi;
            produto.estudo_do_produto.tributos.declarado.ipi.brl = (produto.estudo_do_produto.cif.declarado.brl + produto.estudo_do_produto.tributos.declarado.ii.brl) * produto.impostos.ipi;
            produto.estudo_do_produto.tributos.real.ipi.usd = (produto.estudo_do_produto.cif.real.usd + produto.estudo_do_produto.tributos.real.ii.usd) * produto.impostos.ipi;
            produto.estudo_do_produto.tributos.real.ipi.brl = (produto.estudo_do_produto.cif.real.brl + produto.estudo_do_produto.tributos.real.ii.brl) * produto.impostos.ipi;

            // Cálculo dos Impostos - PIS.
            produto.estudo_do_produto.tributos.declarado.pis.usd = produto.estudo_do_produto.cif.declarado.usd * produto.impostos.pis;
            produto.estudo_do_produto.tributos.declarado.pis.brl = produto.estudo_do_produto.cif.declarado.brl * produto.impostos.pis;
            produto.estudo_do_produto.tributos.real.pis.usd = produto.estudo_do_produto.cif.real.usd * produto.impostos.pis;
            produto.estudo_do_produto.tributos.real.pis.brl = produto.estudo_do_produto.cif.real.brl * produto.impostos.pis;

            // Cálculo dos Impostos - Cofins.
            produto.estudo_do_produto.tributos.declarado.cofins.usd = produto.estudo_do_produto.cif.declarado.usd * produto.impostos.cofins;
            produto.estudo_do_produto.tributos.declarado.cofins.brl = produto.estudo_do_produto.cif.declarado.brl * produto.impostos.cofins;
            produto.estudo_do_produto.tributos.real.cofins.usd = produto.estudo_do_produto.cif.real.usd * produto.impostos.cofins;
            produto.estudo_do_produto.tributos.real.cofins.brl = produto.estudo_do_produto.cif.real.brl * produto.impostos.cofins;

            // Cálculo dos Impostos - ICMS.
            produto.estudo_do_produto.tributos.declarado.icms.usd = (((
                produto.estudo_do_produto.cif.declarado.usd +
                produto.estudo_do_produto.tributos.declarado.ii.usd +
                produto.estudo_do_produto.tributos.declarado.ipi.usd +
                produto.estudo_do_produto.tributos.declarado.pis.usd +
                produto.estudo_do_produto.tributos.declarado.cofins.usd) / (1 - $scope.estudo.aliq_icms)) * $scope.estudo.aliq_icms
            );

            produto.estudo_do_produto.tributos.declarado.icms.brl = (((
                produto.estudo_do_produto.cif.declarado.brl +
                produto.estudo_do_produto.tributos.declarado.ii.brl +
                produto.estudo_do_produto.tributos.declarado.ipi.brl +
                produto.estudo_do_produto.tributos.declarado.pis.brl +
                produto.estudo_do_produto.tributos.declarado.cofins.brl) / (1 - $scope.estudo.aliq_icms)) * $scope.estudo.aliq_icms
            );

            produto.estudo_do_produto.tributos.real.icms.usd = (((
                produto.estudo_do_produto.cif.real.usd +
                produto.estudo_do_produto.tributos.real.ii.usd +
                produto.estudo_do_produto.tributos.real.ipi.usd +
                produto.estudo_do_produto.tributos.real.pis.usd +
                produto.estudo_do_produto.tributos.real.cofins.usd) / (1 - $scope.estudo.aliq_icms)) * $scope.estudo.aliq_icms
            );

            produto.estudo_do_produto.tributos.real.icms.brl = (((
                produto.estudo_do_produto.cif.real.brl +
                produto.estudo_do_produto.tributos.real.ii.brl +
                produto.estudo_do_produto.tributos.real.ipi.brl +
                produto.estudo_do_produto.tributos.real.pis.brl +
                produto.estudo_do_produto.tributos.real.cofins.brl) / (1 - $scope.estudo.aliq_icms)) * $scope.estudo.aliq_icms
            );

            // Cálculo do total de tributos.
            produto.estudo_do_produto.tributos.declarado.total.usd = (
                produto.estudo_do_produto.tributos.declarado.ii.usd +
                produto.estudo_do_produto.tributos.declarado.ipi.usd +
                produto.estudo_do_produto.tributos.declarado.pis.usd +
                produto.estudo_do_produto.tributos.declarado.cofins.usd +
                produto.estudo_do_produto.tributos.declarado.icms.usd
            );

            produto.estudo_do_produto.tributos.declarado.total.brl = (
                produto.estudo_do_produto.tributos.declarado.ii.brl +
                produto.estudo_do_produto.tributos.declarado.ipi.brl +
                produto.estudo_do_produto.tributos.declarado.pis.brl +
                produto.estudo_do_produto.tributos.declarado.cofins.brl +
                produto.estudo_do_produto.tributos.declarado.icms.brl
            );

            produto.estudo_do_produto.tributos.real.total.usd = (
                produto.estudo_do_produto.tributos.real.ii.usd +
                produto.estudo_do_produto.tributos.real.ipi.usd +
                produto.estudo_do_produto.tributos.real.pis.usd +
                produto.estudo_do_produto.tributos.real.cofins.usd +
                produto.estudo_do_produto.tributos.real.icms.usd
            );

            produto.estudo_do_produto.tributos.real.total.brl = (
                produto.estudo_do_produto.tributos.real.ii.brl +
                produto.estudo_do_produto.tributos.real.ipi.brl +
                produto.estudo_do_produto.tributos.real.pis.brl +
                produto.estudo_do_produto.tributos.real.cofins.brl +
                produto.estudo_do_produto.tributos.real.icms.brl
            );

        }

        function tempUpdateImpostosEstudo(produto) {

            // Update (soma) dos valores dos impostos ao Estudo Geral.

            $scope.estudo.tributos.declarado.ii.brl += produto.estudo_do_produto.tributos.declarado.ii.brl;
            $scope.estudo.tributos.declarado.ipi.brl += produto.estudo_do_produto.tributos.declarado.ipi.brl;
            $scope.estudo.tributos.declarado.pis.brl += produto.estudo_do_produto.tributos.declarado.pis.brl;
            $scope.estudo.tributos.declarado.cofins.brl += produto.estudo_do_produto.tributos.declarado.cofins.brl;
            $scope.estudo.tributos.declarado.icms.brl += produto.estudo_do_produto.tributos.declarado.icms.brl;
            $scope.estudo.tributos.declarado.total.brl += produto.estudo_do_produto.tributos.declarado.total.brl;

            $scope.estudo.tributos.real.ii.brl += produto.estudo_do_produto.tributos.real.ii.brl;
            $scope.estudo.tributos.real.ipi.brl += produto.estudo_do_produto.tributos.real.ipi.brl;
            $scope.estudo.tributos.real.pis.brl += produto.estudo_do_produto.tributos.real.pis.brl;
            $scope.estudo.tributos.real.cofins.brl += produto.estudo_do_produto.tributos.real.cofins.brl;
            $scope.estudo.tributos.real.icms.brl += produto.estudo_do_produto.tributos.real.icms.brl;
            $scope.estudo.tributos.real.total.brl += produto.estudo_do_produto.tributos.real.total.brl;

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
                custo_unitario: produto.estudo_do_produto.custo_unitario,
                fob: {declarado: {usd: 0, brl: 0}, real: {usd: 0, brl: 0}, paypal: {usd: 0, brl: 0}},
                cif: {declarado: {usd: 0, brl: 0}, real: {usd: 0, brl: 0}},
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
                tributos: {
                    declarado: {
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
                    total: {
                        usd: 0,
                        brl: 0
                    }
                },

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
                    produto.estudo_do_produto.fob.declarado.usd = produto.estudo_do_produto.custo_unitario.declarado.usd * produto.estudo_do_produto.qtd;
                    produto.estudo_do_produto.fob.declarado.brl = produto.estudo_do_produto.fob.declarado.usd * $scope.estudo.cotacao_dolar;

                    produto.estudo_do_produto.fob.paypal.usd = produto.estudo_do_produto.custo_unitario.paypal.usd * produto.estudo_do_produto.qtd * (1 + $scope.estudo.config.taxa_paypal + $scope.estudo.config.iof_cartao);
                    produto.estudo_do_produto.fob.paypal.brl = produto.estudo_do_produto.fob.paypal.usd * $scope.estudo.cotacao_dolar_paypal;

                    produto.estudo_do_produto.fob.real.usd = produto.estudo_do_produto.custo_unitario.real.usd * produto.estudo_do_produto.qtd;
                    produto.estudo_do_produto.fob.real.brl = produto.estudo_do_produto.fob.real.usd * $scope.estudo.cotacao_dolar;
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

                    $scope.estudo.fob.declarado.usd += produto.estudo_do_produto.custo_unitario.declarado.usd * produto.estudo_do_produto.qtd; // Calcula Fob
                    $scope.estudo.fob.declarado.brl += $scope.estudo.fob.declarado.usd * $scope.estudo.cotacao_dolar;

                    $scope.estudo.fob.real.usd += produto.estudo_do_produto.custo_unitario.real.usd * produto.estudo_do_produto.qtd;
                    $scope.estudo.fob.real.brl += $scope.estudo.fob.real.usd * $scope.estudo.cotacao_dolar;

                    $scope.estudo.totalPaypal += produto.estudo_do_produto.custo_unitario.paypal.usd * produto.estudo_do_produto.qtd; // todo: Ajustar a nomenclatura (totalPaypal não está em acordo com os demais nomes que usam '_').

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
                    produto.estudo_do_produto.frete_maritimo.valor.usd = produto.estudo_do_produto.medidas.peso.ocupado_percentual * $scope.estudo.frete_maritimo.valor.usd;
                    produto.estudo_do_produto.frete_maritimo.valor.brl = produto.estudo_do_produto.frete_maritimo.valor.usd * $scope.estudo.cotacao_dolar;

                    // Cálculo de SEGURO de Frete Marítimo proporcional.
                    produto.estudo_do_produto.frete_maritimo.seguro.usd = produto.estudo_do_produto.medidas.peso.ocupado_percentual * $scope.estudo.frete_maritimo.seguro.usd;
                    produto.estudo_do_produto.frete_maritimo.seguro.brl = produto.estudo_do_produto.frete_maritimo.seguro.usd * $scope.estudo.cotacao_dolar;

                    // Cálculo CIFs (que é o mesmo que Valor Aduaneiro).
                    produto.estudo_do_produto.cif.declarado.usd = produto.estudo_do_produto.fob.declarado.usd + produto.estudo_do_produto.frete_maritimo.valor.usd + produto.estudo_do_produto.frete_maritimo.seguro.usd;
                    produto.estudo_do_produto.cif.declarado.brl = produto.estudo_do_produto.cif.declarado.usd * $scope.estudo.cotacao_dolar;
                    produto.estudo_do_produto.cif.real.usd = produto.estudo_do_produto.fob.real.usd + produto.estudo_do_produto.frete_maritimo.valor.usd + produto.estudo_do_produto.frete_maritimo.seguro.usd;
                    produto.estudo_do_produto.cif.real.brl = produto.estudo_do_produto.cif.real.usd * $scope.estudo.cotacao_dolar;

                    tempCalculaImpostos(produto);

                    // Cálculo do total de despesas proporcional do produto.
                    produto.estudo_do_produto.despesas.total.brl = (produto.estudo_do_produto.cif.declarado.brl / $scope.estudo.cif.declarado.brl) * $scope.estudo.despesas.total.brl;
                    produto.estudo_do_produto.despesas.total.usd = produto.estudo_do_produto.despesas.total.brl / $scope.estudo.cotacao_dolar; // todo: Definir se esta é a melhor forma de calcular este valor.

                    tempUpdateImpostosEstudo(produto);


                    // Cálculo do Investimento (total) a ser feito no produto.
                    produto.estudo_do_produto.investimento_brl = (
                        produto.estudo_do_produto.cif.declarado.brl +
                        produto.estudo_do_produto.fob.paypal.brl + // já considerando a taxa paypal e o IOF sobre compras internacionais do cartão
                        produto.estudo_do_produto.tributos.declarado.total.brl +
                        produto.estudo_do_produto.despesas.total.brl
                    );

                    produto.estudo_do_produto.investimento_integral_brl = (
                        produto.estudo_do_produto.cif.real.brl +
                        produto.estudo_do_produto.tributos.real.total.brl +
                        produto.estudo_do_produto.despesas.total.brl
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
                produto.estudo_do_produto.medidas.peso.ocupado = produto.medidas.peso * produto.estudo_do_produto.qtd;
                produto.estudo_do_produto.medidas.volume.ocupado = produto.medidas.cbm * produto.estudo_do_produto.qtd;

                // Cálculo dos percentuais > Peso e Volume proporcionais do produto
                produto.estudo_do_produto.medidas.peso.ocupado_percentual = produto.estudo_do_produto.medidas.peso.ocupado / $scope.estudo.medidas.peso.ocupado;
                produto.estudo_do_produto.medidas.volume.ocupado_percentual = produto.estudo_do_produto.medidas.volume.ocupado / $scope.estudo.medidas.volume.ocupado;
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

