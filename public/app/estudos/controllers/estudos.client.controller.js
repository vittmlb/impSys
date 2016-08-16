/**
 * Created by Vittorio on 30/05/2016.
 */
angular.module('estudos').controller('EstudosController', ['$scope', '$routeParams', '$location', 'Produtos', 'Despesas', 'Estudos', '$http', '$stateParams', '$state',
    function($scope, $routeParams, $location, Produtos, Despesas, Estudos, $http, $stateParams, $state) {

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
            total_comissao_conny_usd: 0, // todo: Implementar comissão Conny
            total_comissao_conny_brl: 0,
            fob: {
                declarado: { // FOB que constará da Invoice, ou seja, será o total declarado para o governo, mas não contemplará o montante enviado por paypal
                    usd: 0,
                    brl: 0
                },
                cheio: { // FOB real, como se o processo fosse feito integralmente por dentro (sem paypal)
                    usd: 0,
                    brl: 0
                }
            },
            cif: {
                declarado: { // CIF que constará da Invoice, ou seja, será o total declarado para o governo, mas não contemplará o montante enviado por paypal
                    usd: 0,
                    brl: 0
                },
                cheio: { // CIF real, como se o processo fosse feito integralmente por dentro (sem paypal)
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
                declarado: { // Tributos que constarão da Invoice, ou seja, será o total declarado para o governo, mas não contemplará o montante enviado por paypal
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
                cheio: { // Tributaçao real, como se o processo fosse feito integralmente por dentro (sem paypal). Seria o total de impostos a pagar se não houvesse sonegação
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
                aduaneiras: {
                    usd: 0,
                    brl: 0
                },
                internacionais: { // Despesas originadas no exterior.
                    compartilhadas: { // Despesas a serem compartilhadas por todos os produtos (como viagem da Conny para acompanhar o carregamento do contêiner).
                        usd: 0,
                        brl: 0
                    },
                    individualizadas: { // Despesas internacionais que dizem respeito a um único produto (viagem Conny para um fabricante, ou frete do produto para o porto.
                        usd: 0,
                        brl: 0
                    }
                },
                nacionais: {
                    compartilhadas: {
                        usd: 0,
                        brl: 0
                    },
                    individualizadas: {
                        usd: 0,
                        brl: 0
                    }
                },
                total: {
                    usd: 0,
                    brl: 0
                }
            },
            resultados: {
                investimento: {
                    declarado: { // Investimento que constará da Invoice, ou seja, será o total declarado para o governo, mas não contemplará o montante enviado por paypal
                        usd: 0,
                        brl: 0
                    },
                    paypal: { // Investimento feito através do paypal
                        usd: 0,
                        brl: 0
                    },
                    final: { // Montante EFETIVAMENTE desembolsado para a aquisiçao do produto > declarado + paypal
                        brl: 0
                    },
                    cheio: { // Montante que teria sido investido se o processo fosse feito integralmente por dentro (sem paypal)
                        brl: 0
                    }
                },
                lucro: {
                    final: { // Lucro real obtido na operação, contemplando os gastos declarados e o total enviado através do paypal
                        usd: 0,
                        brl: 0
                    }
                },
                roi: { // ROI: Retorno Sobre Investimento > Lucro BRL / Investimento BRL
                    brl: 0
                }
            },
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

        $scope.create = function() {
            var estudo = new Estudos({
                cotacao_dolar: $scope.estudo.cotacao_dolar,
                config: $scope.estudo.config
            });
            estudo.$save(function (response) {
                alert(`Estudo id: ${response._id} criado com sucesso`);
            });
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
            if ($scope.produtosDoEstudo.indexOf(produto) === -1){
                produto.estudo_do_produto = {
                    qtd: 0,
                    custo_unitario: {
                        declarado: { // Custo que constará da Invoice, ou seja, será o custo declarado para o governo, mas não contemplará o montante enviado por paypal
                            usd: produto.custo_usd,
                            brl: 0
                        },
                        paypal: { // Montante do Custo do produto pago através do paypal
                            usd: 0,
                            brl: 0
                        },
                        cheio: { // Montante que teria sido investido se o processo fosse feito integralmente por dentro (sem paypal)
                            usd: produto.custo_usd,
                            brl: 0
                        }
                    },
                    fob: {
                        declarado: { // FOB que constará da Invoice, ou seja, será o total declarado para o governo, mas não contemplará o montante enviado por paypal
                            usd: 0,
                            brl: 0
                        },
                        cheio: { // FOB real, como se o processo fosse feito integralmente por dentro (sem paypal)
                            usd: 0,
                            brl: 0
                        },
                        paypal: {
                            usd: 0,
                            brl: 0
                        }
                    },
                    cif: {
                        declarado: { // CIF que constará da Invoice, ou seja, será o total declarado para o governo, mas não contemplará o montante enviado por paypal
                            usd: 0,
                            brl: 0
                        },
                        cheio: { // CIF real, como se o processo fosse feito integralmente por dentro (sem paypal)
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
                    tributos: {
                        declarado: { // Tributos que constarão da Invoice, ou seja, será o total declarado para o governo, mas não contemplará o montante enviado por paypal
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
                        cheio: { // Tributaçao real, como se o processo fosse feito integralmente por dentro (sem paypal). Seria o total de impostos a pagar se não houvesse sonegação
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
                        aduaneiras: {
                            usd: 0,
                            brl: 0
                        },
                        internacionais: { // Despesas originadas no exterior.
                            compartilhadas: { // Despesas a serem compartilhadas por todos os produtos (como viagem da Conny para acompanhar o carregamento do contêiner).
                                usd: 0,
                                brl: 0
                            },
                            individualizadas: { // Despesas internacionais que dizem respeito a um único produto (viagem Conny para um fabricante, ou frete do produto para o porto.
                                usd: 0,
                                brl: 0
                            },
                            totais: { // Somatório das despesas compartilhadas e individualizadas.
                                usd: 0,
                                brl: 0
                            }
                        },
                        nacionais: { // Despesas originadas no exterior.
                            compartilhadas: { // Despesas a serem compartilhadas por todos os produtos (como viagem da Conny para acompanhar o carregamento do contêiner).
                                usd: 0,
                                brl: 0
                            },
                            individualizadas: { // Despesas internacionais que dizem respeito a um único produto (viagem Conny para um fabricante, ou frete do produto para o porto.
                                usd: 0,
                                brl: 0
                            },
                            totais: { // Somatório das despesas compartilhadas e individualizadas.
                                usd: 0,
                                brl: 0
                            }
                        },
                        total: {
                            usd: 0,
                            brl: 0
                        }
                    },
                    resultados: {
                        investimento: { // Campo que designa o somatório dos custos unitários
                            declarado: { // Investimento que constará da Invoice, ou seja, será o total declarado para o governo, mas não contemplará o montante enviado por paypal
                                usd: 0,
                                brl: 0
                            },
                            paypal: { // Investimento feito através do paypal
                                usd: 0,
                                brl: 0
                            },
                            final: { // Montante EFETIVAMENTE desembolsado para a aquisiçao do produto > declarado + paypal
                                brl: 0
                            },
                            cheio: { // Montante que teria sido investido se o processo fosse feito integralmente por dentro (sem paypal)
                                brl: 0
                            }
                        },
                        lucro: {
                            unitario: { // Lucro real obtido na venda de CADA produto
                                brl: 0
                            },
                            total: { // Lucro real obtido na venda de TODOS os produtos
                                brl: 0
                            },
                        },
                        roi: { // ROI: Retorno Sobre Investimento > Lucro BRL / Investimento BRL
                            brl: 0
                        },
                        precos: {
                            custo: {
                                declarado: { // Preço de custo unitário baseado apenas no valor declarado - Não incluirá o montante enviado através do paypal
                                    usd: 0,
                                    brl: 0
                                },
                                paypal: { // Preço de custo unitário baseado apenas no valor enviado através do paypal, bem como nas taxas correspondentes
                                    usd: 0,
                                    brl: 0
                                },
                                final: { // Preço de custo unitário REAL (valor que o produto efetivamente custou ao final do processo), incluindo o declarado e paypal
                                    brl: 0
                                },
                                cheio: { // Preço de custo unitário do produto se toda a operação fosse feita "por dentro", sem envio de dinheiro pelo paypal
                                    brl: 0
                                }
                            },
                            venda: {
                                brl: 0
                            }
                        }
                    },
                };
                $scope.produtosDoEstudo.push(produto);
            }
        };

        $scope.removeProdutoEstudo = function(item) {
            $scope.produtosDoEstudo.splice($scope.produtosDoEstudo.indexOf(item), 1);
            $scope.iniImport();
        };

        $scope.calculaCustoPaypal = function(produto, nomeCampo) {
            if(nomeCampo === 'custo_paypal') {
                produto.estudo_do_produto.custo_unitario.declarado.usd = produto.estudo_do_produto.custo_unitario.cheio.usd - produto.estudo_do_produto.custo_unitario.paypal.usd;
            } else {
                produto.estudo_do_produto.custo_unitario.paypal.usd = produto.estudo_do_produto.custo_unitario.cheio.usd - produto.estudo_do_produto.custo_unitario.declarado.usd;
            }
            $scope.iniImport();
        };

        $scope.diluiDespesaDoProduto = function(produto) {
            if(produto.estudo_do_produto.qtd > 0) {
                if(produto.estudo_do_produto.despesas.internacionais.individualizadas.usd > 0) {
                    var despesaDiluidaProduto = produto.estudo_do_produto.despesas.internacionais.individualizadas.usd / produto.estudo_do_produto.qtd;
                    produto.estudo_do_produto.custo_unitario.cheio.usd = produto.custo_usd + despesaDiluidaProduto;
                    produto.estudo_do_produto.custo_unitario.paypal.usd = despesaDiluidaProduto;
                    $scope.calculaCustoPaypal(produto, 'custo_paypal');
                }
            } else { // todo: Lembrar que a quantidade pode ser negativa (encontrar uma forma de validar)
                if(produto.custo_usd !== produto.estudo_do_produto.custo_unitario.cheio.usd) {
                    produto.estudo_do_produto.custo_unitario.cheio.usd = produto.custo_usd;
                    produto.estudo_do_produto.custo_unitario.paypal.usd = 0;
                    $scope.calculaCustoPaypal(produto, 'custo_paypal');
                } else {
                    produto.estudo_do_produto.despesas.internacionais.individualizadas.usd = 0;
                    alert('A quantidade do produto não pode ser igual a zero'); // todo: Usar o sistema de notificação.
                }
            }
        };

        function tempCalculaImpostos(produto) {

            // Cálculo dos Impostos - II.
            produto.estudo_do_produto.tributos.declarado.ii.usd = produto.estudo_do_produto.cif.declarado.usd * produto.impostos.ii;
            produto.estudo_do_produto.tributos.declarado.ii.brl = produto.estudo_do_produto.cif.declarado.brl * produto.impostos.ii;
            produto.estudo_do_produto.tributos.cheio.ii.usd = produto.estudo_do_produto.cif.cheio.usd * produto.impostos.ii;
            produto.estudo_do_produto.tributos.cheio.ii.brl = produto.estudo_do_produto.cif.cheio.brl * produto.impostos.ii;

            // Cálculo dos Impostos - IPI.
            produto.estudo_do_produto.tributos.declarado.ipi.usd = (produto.estudo_do_produto.cif.declarado.usd + produto.estudo_do_produto.tributos.declarado.ii.usd) * produto.impostos.ipi;
            produto.estudo_do_produto.tributos.declarado.ipi.brl = (produto.estudo_do_produto.cif.declarado.brl + produto.estudo_do_produto.tributos.declarado.ii.brl) * produto.impostos.ipi;
            produto.estudo_do_produto.tributos.cheio.ipi.usd = (produto.estudo_do_produto.cif.cheio.usd + produto.estudo_do_produto.tributos.cheio.ii.usd) * produto.impostos.ipi;
            produto.estudo_do_produto.tributos.cheio.ipi.brl = (produto.estudo_do_produto.cif.cheio.brl + produto.estudo_do_produto.tributos.cheio.ii.brl) * produto.impostos.ipi;

            // Cálculo dos Impostos - PIS.
            produto.estudo_do_produto.tributos.declarado.pis.usd = produto.estudo_do_produto.cif.declarado.usd * produto.impostos.pis;
            produto.estudo_do_produto.tributos.declarado.pis.brl = produto.estudo_do_produto.cif.declarado.brl * produto.impostos.pis;
            produto.estudo_do_produto.tributos.cheio.pis.usd = produto.estudo_do_produto.cif.cheio.usd * produto.impostos.pis;
            produto.estudo_do_produto.tributos.cheio.pis.brl = produto.estudo_do_produto.cif.cheio.brl * produto.impostos.pis;

            // Cálculo dos Impostos - Cofins.
            produto.estudo_do_produto.tributos.declarado.cofins.usd = produto.estudo_do_produto.cif.declarado.usd * produto.impostos.cofins;
            produto.estudo_do_produto.tributos.declarado.cofins.brl = produto.estudo_do_produto.cif.declarado.brl * produto.impostos.cofins;
            produto.estudo_do_produto.tributos.cheio.cofins.usd = produto.estudo_do_produto.cif.cheio.usd * produto.impostos.cofins;
            produto.estudo_do_produto.tributos.cheio.cofins.brl = produto.estudo_do_produto.cif.cheio.brl * produto.impostos.cofins;

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

            produto.estudo_do_produto.tributos.cheio.icms.usd = (((
                produto.estudo_do_produto.cif.cheio.usd +
                produto.estudo_do_produto.tributos.cheio.ii.usd +
                produto.estudo_do_produto.tributos.cheio.ipi.usd +
                produto.estudo_do_produto.tributos.cheio.pis.usd +
                produto.estudo_do_produto.tributos.cheio.cofins.usd) / (1 - $scope.estudo.aliq_icms)) * $scope.estudo.aliq_icms
            );

            produto.estudo_do_produto.tributos.cheio.icms.brl = (((
                produto.estudo_do_produto.cif.cheio.brl +
                produto.estudo_do_produto.tributos.cheio.ii.brl +
                produto.estudo_do_produto.tributos.cheio.ipi.brl +
                produto.estudo_do_produto.tributos.cheio.pis.brl +
                produto.estudo_do_produto.tributos.cheio.cofins.brl) / (1 - $scope.estudo.aliq_icms)) * $scope.estudo.aliq_icms
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

            produto.estudo_do_produto.tributos.cheio.total.usd = (
                produto.estudo_do_produto.tributos.cheio.ii.usd +
                produto.estudo_do_produto.tributos.cheio.ipi.usd +
                produto.estudo_do_produto.tributos.cheio.pis.usd +
                produto.estudo_do_produto.tributos.cheio.cofins.usd +
                produto.estudo_do_produto.tributos.cheio.icms.usd
            );

            produto.estudo_do_produto.tributos.cheio.total.brl = (
                produto.estudo_do_produto.tributos.cheio.ii.brl +
                produto.estudo_do_produto.tributos.cheio.ipi.brl +
                produto.estudo_do_produto.tributos.cheio.pis.brl +
                produto.estudo_do_produto.tributos.cheio.cofins.brl +
                produto.estudo_do_produto.tributos.cheio.icms.brl
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

            $scope.estudo.tributos.cheio.ii.brl += produto.estudo_do_produto.tributos.cheio.ii.brl;
            $scope.estudo.tributos.cheio.ipi.brl += produto.estudo_do_produto.tributos.cheio.ipi.brl;
            $scope.estudo.tributos.cheio.pis.brl += produto.estudo_do_produto.tributos.cheio.pis.brl;
            $scope.estudo.tributos.cheio.cofins.brl += produto.estudo_do_produto.tributos.cheio.cofins.brl;
            $scope.estudo.tributos.cheio.icms.brl += produto.estudo_do_produto.tributos.cheio.icms.brl;
            $scope.estudo.tributos.cheio.total.brl += produto.estudo_do_produto.tributos.cheio.total.brl;

        }

        function calculaResultadosPorProduto(produto) {
            produto.estudo_do_produto.resultados.lucro.unitario.brl = (produto.estudo_do_produto.resultados.precos.venda.brl * (1 - $scope.estudo.config.aliquota_simples - $scope.estudo.config.comissao_ml)) - produto.estudo_do_produto.resultados.precos.custo.final.brl;
            produto.estudo_do_produto.resultados.lucro.total.brl = produto.estudo_do_produto.resultados.lucro.unitario.brl * produto.estudo_do_produto.qtd;
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
                custo_unitario: produto.estudo_do_produto.custo_unitario,
                fob: {declarado: {usd: 0, brl: 0}, cheio: {usd: 0, brl: 0}, paypal: {usd: 0, brl: 0}},
                cif: {declarado: {usd: 0, brl: 0}, cheio: {usd: 0, brl: 0}},
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
                    cheio: {
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
                    aduaneiras: {
                        usd: 0,
                        brl: 0
                    },
                    internacionais: { // Despesas originadas no exterior.
                        compartilhadas: { // Despesas a serem compartilhadas por todos os produtos (como viagem da Conny para acompanhar o carregamento do contêiner).
                            usd: 0,
                            brl: 0
                        },
                        individualizadas: { // Despesas internacionais que dizem respeito a um único produto (viagem Conny para um fabricante, ou frete do produto para o porto.
                            usd: 0,
                            brl: 0
                        },
                        totais: { // Somatório das despesas compartilhadas e individualizadas.
                            usd: 0,
                            brl: 0
                        }
                    },
                    nacionais: { // Despesas originadas no exterior.
                        compartilhadas: { // Despesas a serem compartilhadas por todos os produtos (como viagem da Conny para acompanhar o carregamento do contêiner).
                            usd: 0,
                            brl: 0
                        },
                        individualizadas: { // Despesas internacionais que dizem respeito a um único produto (viagem Conny para um fabricante, ou frete do produto para o porto.
                            usd: 0,
                            brl: 0
                        },
                        totais: { // Somatório das despesas compartilhadas e individualizadas.
                            usd: 0,
                            brl: 0
                        }
                    },
                    total: { // todo: confirmar se nos demais objetos o nome é total ou totais
                        usd: 0,
                        brl: 0
                    }
                },
                resultados: {
                    investimento: { // Campo que designa o somatório dos custos unitários
                        declarado: { // Investimento que constará da Invoice, ou seja, será o total declarado para o governo, mas não contemplará o montante enviado por paypal
                            usd: 0,
                            brl: 0
                        },
                        paypal: { // Investimento feito através do paypal
                            usd: 0,
                            brl: 0
                        },
                        final: { // Montante EFETIVAMENTE desembolsado para a aquisiçao do produto > declarado + paypal
                            brl: 0
                        },
                        cheio: { // Montante que teria sido investido se o processo fosse feito integralmente por dentro (sem paypal)
                            brl: 0
                        }
                    },
                    lucro: {
                        unitario: { // Lucro real obtido na venda de CADA produto
                            brl: 0
                        },
                        total: { // Lucro real obtido na venda de TODOS os produtos
                            brl: 0
                        },
                    },
                    roi: { // ROI: Retorno Sobre Investimento > Lucro BRL / Investimento BRL
                        brl: 0
                    },
                    precos: {
                        custo: {
                            declarado: { // Preço de custo unitário baseado apenas no valor declarado - Não incluirá o montante enviado através do paypal
                                usd: 0,
                                brl: 0
                            },
                            paypal: { // Preço de custo unitário baseado apenas no valor enviado através do paypal, bem como nas taxas correspondentes
                                usd: 0,
                                brl: 0
                            },
                            final: { // Preço de custo unitário REAL (valor que o produto efetivamente custou ao final do processo), incluindo o declarado e paypal
                                brl: 0
                            },
                            cheio: { // Preço de custo unitário do produto se toda a operação fosse feita "por dentro", sem envio de dinheiro pelo paypal
                                brl: 0
                            }
                        },
                        venda: {
                            brl: 0
                        }
                    }
                },

            };
        }

        //region Etapas para cálculo do estudo - iniImp()
        // 1
        /**
         * Zera os valores de todos os acumuladores do objeto <$scope.estudo>
         */
        function zeraDadosEstudo() {

            $scope.estudo.fob = {declarado: {usd: 0, brl: 0}, cheio: {usd: 0, brl: 0}};
            $scope.estudo.cif = {declarado: {usd: 0, brl: 0}, cheio: {usd: 0, brl: 0}};

            $scope.estudo.totalPaypal = 0; // todo: Descobrir para que serve
            $scope.estudo.totalPeso = 0; // todo: Descobrir para que serve
            $scope.estudo.volume_ocupado = 0; // todo: Descobrir para que serve

            $scope.estudo.tributos.declarado = {ii: {usd: 0, brl: 0}, ipi: {usd: 0, brl: 0}, pis: {usd: 0, brl: 0}, cofins: {usd: 0, brl: 0}, icms: {usd: 0, brl: 0}, total: {usd: 0, brl: 0}};
            $scope.estudo.tributos.cheio = {ii: {usd: 0, brl: 0}, ipi: {usd: 0, brl: 0}, pis: {usd: 0, brl: 0}, cofins: {usd: 0, brl: 0}, icms: {usd: 0, brl: 0}, total: {usd: 0, brl: 0}};

            $scope.estudo.despesas.total.brl = 0;
            $scope.estudo.despesas.afrmm.brl = 0;

            $scope.estudo.medidas.peso = {contratado: 0, ocupado: 0, ocupado_percentual: 0};
            $scope.estudo.medidas.volume = {contratado: 0, ocupado: 0, ocupado_percentual: 0};

            $scope.estudo.resultados.investimento = {declarado: {usd: 0, brl: 0}, paypal: {usd: 0, brl: 0}, final: {brl: 0}, cheio: {brl: 0}};
            $scope.estudo.resultados.lucro = {final: {usd: 0, brl: 0}};
            $scope.estudo.resultados.roi = {brl: 0};

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
                    produto.estudo_do_produto.fob.declarado.usd = ((produto.estudo_do_produto.custo_unitario.declarado.usd * (1 + $scope.estudo.config.percentual_comissao_conny)) * produto.estudo_do_produto.qtd);
                    produto.estudo_do_produto.fob.declarado.brl = produto.estudo_do_produto.fob.declarado.usd * $scope.estudo.cotacao_dolar;

                    produto.estudo_do_produto.fob.paypal.usd = ((produto.estudo_do_produto.custo_unitario.paypal.usd) * (1 + $scope.estudo.config.percentual_comissao_conny)) * produto.estudo_do_produto.qtd * (1 + $scope.estudo.config.taxa_paypal + $scope.estudo.config.iof_cartao);
                    produto.estudo_do_produto.fob.paypal.brl = produto.estudo_do_produto.fob.paypal.usd * $scope.estudo.cotacao_dolar_paypal;

                    produto.estudo_do_produto.fob.cheio.usd = ((produto.estudo_do_produto.custo_unitario.cheio.usd) * (1 + $scope.estudo.config.percentual_comissao_conny)) * produto.estudo_do_produto.qtd;
                    produto.estudo_do_produto.fob.cheio.brl = produto.estudo_do_produto.fob.cheio.usd * $scope.estudo.cotacao_dolar;
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

                    $scope.estudo.fob.cheio.usd += produto.estudo_do_produto.custo_unitario.cheio.usd * produto.estudo_do_produto.qtd;
                    $scope.estudo.fob.cheio.brl += $scope.estudo.fob.cheio.usd * $scope.estudo.cotacao_dolar;

                    // $scope.estudo.totalPaypal += produto.estudo_do_produto.custo_unitario.paypal.usd * produto.estudo_do_produto.qtd; // todo: Ajustar a nomenclatura (totalPaypal não está em acordo com os demais nomes que usam '_').

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

            $scope.estudo.cif.cheio.usd = $scope.estudo.fob.cheio.usd + $scope.estudo.frete_maritimo.valor.usd + $scope.estudo.frete_maritimo.seguro.usd;
            $scope.estudo.cif.cheio.brl = $scope.estudo.cif.cheio.usd * $scope.estudo.cotacao_dolar;

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
                    produto.estudo_do_produto.cif.cheio.usd = produto.estudo_do_produto.fob.cheio.usd + produto.estudo_do_produto.frete_maritimo.valor.usd + produto.estudo_do_produto.frete_maritimo.seguro.usd;
                    produto.estudo_do_produto.cif.cheio.brl = produto.estudo_do_produto.cif.cheio.usd * $scope.estudo.cotacao_dolar;

                    tempCalculaImpostos(produto);

                    // Cálculo do total de despesas proporcional do produto.
                    produto.estudo_do_produto.despesas.total.brl = (produto.estudo_do_produto.cif.declarado.brl / $scope.estudo.cif.declarado.brl) * $scope.estudo.despesas.total.brl;
                    produto.estudo_do_produto.despesas.total.usd = produto.estudo_do_produto.despesas.total.brl / $scope.estudo.cotacao_dolar; // todo: Definir se esta é a melhor forma de calcular este valor.

                    tempUpdateImpostosEstudo(produto);

                    // Cálculo do Investimento (total = Declarado + paypal) a ser feito no produto.
                    produto.estudo_do_produto.resultados.investimento.final.brl = (
                        produto.estudo_do_produto.cif.declarado.brl +
                        produto.estudo_do_produto.fob.paypal.brl + // já considerando a taxa paypal e o IOF sobre compras internacionais do cartão
                        produto.estudo_do_produto.tributos.declarado.total.brl +
                        produto.estudo_do_produto.despesas.total.brl
                    );

                    produto.estudo_do_produto.resultados.investimento.cheio.brl = (
                        produto.estudo_do_produto.cif.cheio.brl +
                        produto.estudo_do_produto.tributos.cheio.total.brl +
                        produto.estudo_do_produto.despesas.total.brl
                    );

                    $scope.estudo.resultados.investimento.final.brl += produto.estudo_do_produto.resultados.investimento.final.brl;
                    $scope.estudo.resultados.investimento.cheio.brl += produto.estudo_do_produto.resultados.investimento.cheio.brl;

                    // Cálculo do preço de Custo final do produto.
                    produto.estudo_do_produto.resultados.precos.custo.final.brl = produto.estudo_do_produto.resultados.investimento.final.brl / produto.estudo_do_produto.qtd;
                    produto.estudo_do_produto.resultados.precos.custo.cheio.brl = produto.estudo_do_produto.resultados.investimento.cheio.brl / produto.estudo_do_produto.qtd;


                    // Calcula o resultado unitário e total de cada um dos produtos.
                    calculaResultadosPorProduto(produto);

                    // Update (soma) dos lucros dos produtos para formar o Lucro Total do Estudo.
                    $scope.estudo.resultados.lucro.final.brl += produto.estudo_do_produto.resultados.lucro.total.brl;


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

