/**
 * Created by Vittorio on 30/05/2016.
 */
angular.module('estudos').controller('EstudosController', ['$scope', '$uibModal', '$routeParams', '$location', 'Produtos', 'Despesas', 'Estudos', '$http', '$stateParams', 'toaster',
    function($scope, $uibModal, $routeParams, $location, Produtos, Despesas, Estudos, $http, $stateParams, toaster) {

        $scope.quantidades = [];
        $scope.produtosDoEstudo = [];
        $scope.estudo = {
            nome_estudo: '',
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
                    compartilhadas: [],
                    // compartilhadas: [{ // Despesas a serem compartilhadas por todos os produtos (como viagem da Conny para acompanhar o carregamento do contêiner).
                    //     desc: '',
                    //     usd: 0,
                    //     brl: 0
                    // }],
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
            comissao_conny: 0,
            comissao_ml: 0,
            aliquota_simples: 0,
            percentual_comissao_conny: 0
        };

        $scope.despesa_internacional = {
            // Variável referenciada no formulário modal usada para inserir a despesa em <$scope.estudo> despesas[].
            // Despesas a serem compartilhadas por todos os produtos (como viagem da Conny para acompanhar o carregamento do contêiner).
            // desc: '',
            // usd: 0,
            // brl: 0
        };

        $scope.create = function() {
            var arrayTestes = [];
            for(var i = 0; i < $scope.produtosDoEstudo.length; i++) {
                var obj = {
                    produto_ref: $scope.produtosDoEstudo[i],
                    estudo_do_produto: $scope.produtosDoEstudo[i].estudo_do_produto
                };
                arrayTestes.push(obj);
            }
            var estudo = new Estudos({
                nome_estudo: $scope.estudo.nome_estudo,
                estudo: $scope.estudo,
                produtosDoEstudo: arrayTestes,
                config: $scope.config
            });
            estudo.$save(function (response) {
                alert(`Estudo id: ${response._id} criado com sucesso`);
            }, function(errorResponse) {
                console.log(errorResponse);
                toaster.pop({
                    type: 'error',
                    title: 'Erro',
                    body: errorResponse,
                    timeout: 3000
                });
            });
        };
        $scope.loadOne = function(id) {
            Estudos.get({
                estudoId: id
            }).$promise.then(function (data) {
                var estudo = data;
                //$scope.estudo = estudo.estudo;
                var prdEstudo = estudo.produtosDoEstudo;
                for (var i = 0; i < prdEstudo.length; i++) {
                    var produto = prdEstudo[i].produto_ref;
                    produto.estudo_do_produto = prdEstudo[i].estudo_do_produto;
                    $scope.produtosDoEstudo.push(produto);
                }
                $scope.config = data.config;
                $scope.iniImport();
            });
        };
        $scope.loadAll = function() {
            Estudos.query().$promise.then(function (data) {
                $scope.loadedEstudos = data;
            });
            // $scope.loadedEstudos = Estudos.query();
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
         * Invoca o formulário modal em que o usuário vai informar o nome e o valor da despesa compartilhada.
         */
        $scope.addDespesaInternacionalCompartilhadaModal = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/estudos/views/modals/adiciona-despesa-internacional-compartilhada.modal.view.html',
                controller: ModalInstanceCtrl,
                scope: $scope,
                windowClass: 'animated flipInY'
            });
        };

        /**
         * Evento invocado pelo formulário modal. Adiciona o "objeto" despesa internacional compartilhada ao array de respectivas despesas.
         */
        $scope.addDespesaInternacionalCompartilhada = function() {
            $scope.despesa_internacional.brl = $scope.despesa_internacional.usd * $scope.config.cotacao_dolar; // Convertendo despesa internacional para brl.
            $scope.estudo.despesas.internacionais.compartilhadas.push($scope.despesa_internacional); // todo: Ver como "zerar" o objeto.
            $scope.despesa_internacional = {};
            $scope.iniImport();
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

        /**
         * Ajusta os valores digitados na tabela do produto da página main-estudos.client.view.html
         * <custo_cheio> / <custo_paypal> / <custo_dentro> / <qtd> / <despesas>
         * @param produto - objeto <produto> proveniente da iteração ng-repeat pelos produtos adicionados ao estudo.
         * @param campo - string utilizada para designar qual é o campo que está sendo modificado.
         */
        $scope.processaMudancas = function(produto, campo) {
            // As variáveis abaixo servem apenas para reduzir o tamanho dos nomes.
            var aux = produto.estudo_do_produto;
            var desp = aux.despesas.internacionais.individualizadas.usd;
            var cUnit = produto.estudo_do_produto.custo_unitario;
            var despUnit = 0;
            if(aux.qtd > 0) {
                despUnit = desp / aux.qtd;
            }
            var cCheio = produto.custo_usd + despUnit;
            cUnit.cheio.usd = cCheio; // Este objeto é inicializado com o valor custo_usd do produto. Aqui ele é alterado para refletir o total inicial + as despesas do produto.
            switch (campo) {
                case 'custo_paypal':
                    cUnit.declarado.usd = cCheio - cUnit.paypal.usd;
                    break;
                case 'custo_dentro':
                    cUnit.paypal.usd = cCheio - cUnit.declarado.usd;
                    break;
                case 'qtd':
                    cUnit.paypal.usd = cUnit.paypal.usd + despUnit;
                    cUnit.declarado.usd = cCheio - cUnit.paypal.usd;
                    break;
                case 'despesas':
                    cUnit.paypal.usd = cUnit.paypal.usd + despUnit;
                    cUnit.declarado.usd = cCheio - cUnit.paypal.usd;
                    break;
            }
            testaSomatorioValoresProduto(produto);
            $scope.iniImport();
        };

        /**
         * Funçao provisória para testar se cada produto que tem seus valores alterados em algum campo da tabela de produtos apresenta o somatório de custos que compõe o preço final do ítem estão corretos.
         * todo: Apagar esta funçao assim que possível.
         * @param produto
         * @returns {boolean}
         */
        function testaSomatorioValoresProduto(produto) {
            var aux = produto.estudo_do_produto;
            var desp = aux.despesas.internacionais.individualizadas.usd;
            var cUnit = produto.estudo_do_produto.custo_unitario;
            var custo = produto.custo_usd;
            var despUnit = 0;
            if(aux.qtd > 0) {
                despUnit = desp / aux.qtd;
            }
            $scope.auxTestes = areEqual((custo + despUnit), (cUnit.cheio.usd), (cUnit.paypal.usd + cUnit.declarado.usd));
            return ((custo + despUnit) === (cUnit.cheio.usd) === (cUnit.paypal.usd + cUnit.declarado.usd));
        }

        /**
         * Função muito útil para comparar x variáveis e descobrir se são iguais entre si.
         * @returns {boolean}
         */
        function areEqual(){
            var len = arguments.length;
            for (var i = 1; i< len; i++){
                if (arguments[i] == null || arguments[i] != arguments[i-1])
                    return false;
            }
            return true;
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
        function totalizaDespesasDoEstudoOld() {

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

        // 6
        /**
         * Itera pelo objeto <$scope.despesas> e faz o somatório para adicionar ao <$scope.estudo>
         */
        function totalizaDespesasDoEstudo() {

            var desp = $scope.estudo.despesas;

            var aliqAfrmm = $scope.despesas.filter(function(item) {
                return item.nome === 'Taxa AFRMM'; // todo: Criar mecanismo de Erro quando não encontrar a taxa.
            });
            desp.afrmm.brl = $scope.estudo.frete_maritimo.valor.brl * aliqAfrmm[0].aliquota; //todo: Confirmar sobre a incidência do imposto (taxa de desembarque???)
            desp.afrmm.usd = desp.afrmm.brl * $scope.config.cotacao_dolar;

            // desp.total = Somatório de despesas aduaneiras + afrmm.
            desp.total.brl = desp.afrmm.brl; // Ao invés de iniciar as despesas com zero, já inicializo com o afrmm.
            $scope.despesas.forEach(function (item) {
                if(item.tipo === 'despesa aduaneira' && item.ativa === true) {
                    if(item.moeda === 'U$') {
                        desp.total.brl += (item.valor * $scope.estudo.cotacao_dolar);
                    } else {
                        desp.total.brl += item.valor;
                    }
                }
            });
            desp.total.usd = desp.total.brl * $scope.config.cotacao_dolar;

        }

        function totalizaDespesasInternacionaisCompartilhadas() {
            var total = {usd: 0, brl: 0};
            var desp = $scope.estudo.despesas.internacionais.compartilhadas
            for(var i = 0; i < desp.length; i++) {
                total.usd += desp.usd;
                total.brl += desp.brl;
            }
            return total;
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

                    var estProd = produto.estudo_do_produto; // Simplificando a variável para reduzir o espaço e facilitar a leitura.

                    // Cálculo de Frete Marítimo proporcional.
                    estProd.frete_maritimo.valor.usd = estProd.medidas.peso.ocupado_percentual * $scope.estudo.frete_maritimo.valor.usd;
                    estProd.frete_maritimo.valor.brl = estProd.frete_maritimo.valor.usd * $scope.estudo.cotacao_dolar;

                    // Cálculo de SEGURO de Frete Marítimo proporcional.
                    estProd.frete_maritimo.seguro.usd = estProd.medidas.peso.ocupado_percentual * $scope.estudo.frete_maritimo.seguro.usd;
                    estProd.frete_maritimo.seguro.brl = estProd.frete_maritimo.seguro.usd * $scope.estudo.cotacao_dolar;

                    // Cálculo CIFs (que é o mesmo que Valor Aduaneiro).
                    estProd.cif.declarado.usd = estProd.fob.declarado.usd + estProd.frete_maritimo.valor.usd + estProd.frete_maritimo.seguro.usd;
                    estProd.cif.declarado.brl = estProd.cif.declarado.usd * $scope.estudo.cotacao_dolar;
                    estProd.cif.cheio.usd = estProd.fob.cheio.usd + estProd.frete_maritimo.valor.usd + estProd.frete_maritimo.seguro.usd;
                    estProd.cif.cheio.brl = estProd.cif.cheio.usd * $scope.estudo.cotacao_dolar;

                    calculaImpostosProduto(produto); // Calcula todos os impostos do produto, que depois servirá de base para a totalização dos impostos do estudo.

                    totalizaDespesasDoProduto(produto);

                    totalizaImpostosEstudo(produto);

                    // Cálculo do Investimento (total = Declarado + paypal) a ser feito no produto.
                    estProd.resultados.investimento.final.brl = (
                        estProd.cif.declarado.brl +
                        estProd.fob.paypal.brl + // já considerando a taxa paypal e o IOF sobre compras internacionais do cartão
                        estProd.tributos.declarado.total.brl +
                        estProd.despesas.total.brl
                    );

                    estProd.resultados.investimento.cheio.brl = (
                        estProd.cif.cheio.brl +
                        estProd.tributos.cheio.total.brl +
                        estProd.despesas.total.brl
                    );

                    $scope.estudo.resultados.investimento.final.brl += estProd.resultados.investimento.final.brl;
                    $scope.estudo.resultados.investimento.cheio.brl += estProd.resultados.investimento.cheio.brl;

                    // Cálculo do preço de Custo final do produto.
                    estProd.resultados.precos.custo.final.brl = estProd.resultados.investimento.final.brl / estProd.qtd;
                    estProd.resultados.precos.custo.cheio.brl = estProd.resultados.investimento.cheio.brl / estProd.qtd;


                    // Calcula o resultado unitário e total de cada um dos produtos.
                    calculaResultadosPorProduto(produto);

                    // Update (soma) dos lucros dos produtos para formar o Lucro Total do Estudo.
                    $scope.estudo.resultados.lucro.final.brl += estProd.resultados.lucro.total.brl;

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

        /**
         * Função para cálculo dos impostos do Produto
         * Servirá como base para a totalização dos impostos do estudo "geral"
         * @param produto
         */
        function calculaImpostosProduto(produto) {

            var estProd = produto.estudo_do_produto; // Simplificando a variável para reduzir o espaço e facilitar a leitura.

            // Cálculo dos Impostos - II.
            estProd.tributos.declarado.ii.usd = estProd.cif.declarado.usd * produto.impostos.ii;
            estProd.tributos.declarado.ii.brl = estProd.cif.declarado.brl * produto.impostos.ii;
            estProd.tributos.cheio.ii.usd = estProd.cif.cheio.usd * produto.impostos.ii;
            estProd.tributos.cheio.ii.brl = estProd.cif.cheio.brl * produto.impostos.ii;

            // Cálculo dos Impostos - IPI.
            estProd.tributos.declarado.ipi.usd = (estProd.cif.declarado.usd + estProd.tributos.declarado.ii.usd) * produto.impostos.ipi;
            estProd.tributos.declarado.ipi.brl = (estProd.cif.declarado.brl + estProd.tributos.declarado.ii.brl) * produto.impostos.ipi;
            estProd.tributos.cheio.ipi.usd = (estProd.cif.cheio.usd + estProd.tributos.cheio.ii.usd) * produto.impostos.ipi;
            estProd.tributos.cheio.ipi.brl = (estProd.cif.cheio.brl + estProd.tributos.cheio.ii.brl) * produto.impostos.ipi;

            // Cálculo dos Impostos - PIS.
            estProd.tributos.declarado.pis.usd = estProd.cif.declarado.usd * produto.impostos.pis;
            estProd.tributos.declarado.pis.brl = estProd.cif.declarado.brl * produto.impostos.pis;
            estProd.tributos.cheio.pis.usd = estProd.cif.cheio.usd * produto.impostos.pis;
            estProd.tributos.cheio.pis.brl = estProd.cif.cheio.brl * produto.impostos.pis;

            // Cálculo dos Impostos - Cofins.
            estProd.tributos.declarado.cofins.usd = estProd.cif.declarado.usd * produto.impostos.cofins;
            estProd.tributos.declarado.cofins.brl = estProd.cif.declarado.brl * produto.impostos.cofins;
            estProd.tributos.cheio.cofins.usd = estProd.cif.cheio.usd * produto.impostos.cofins;
            estProd.tributos.cheio.cofins.brl = estProd.cif.cheio.brl * produto.impostos.cofins;

            // Cálculo dos Impostos - ICMS.
            estProd.tributos.declarado.icms.usd = (((
                estProd.cif.declarado.usd +
                estProd.tributos.declarado.ii.usd +
                estProd.tributos.declarado.ipi.usd +
                estProd.tributos.declarado.pis.usd +
                estProd.tributos.declarado.cofins.usd) / (1 - $scope.estudo.aliq_icms)) * $scope.estudo.aliq_icms
            );

            estProd.tributos.declarado.icms.brl = (((
                estProd.cif.declarado.brl +
                estProd.tributos.declarado.ii.brl +
                estProd.tributos.declarado.ipi.brl +
                estProd.tributos.declarado.pis.brl +
                estProd.tributos.declarado.cofins.brl) / (1 - $scope.estudo.aliq_icms)) * $scope.estudo.aliq_icms
            );

            estProd.tributos.cheio.icms.usd = (((
                estProd.cif.cheio.usd +
                estProd.tributos.cheio.ii.usd +
                estProd.tributos.cheio.ipi.usd +
                estProd.tributos.cheio.pis.usd +
                estProd.tributos.cheio.cofins.usd) / (1 - $scope.estudo.aliq_icms)) * $scope.estudo.aliq_icms
            );

            estProd.tributos.cheio.icms.brl = (((
                estProd.cif.cheio.brl +
                estProd.tributos.cheio.ii.brl +
                estProd.tributos.cheio.ipi.brl +
                estProd.tributos.cheio.pis.brl +
                estProd.tributos.cheio.cofins.brl) / (1 - $scope.estudo.aliq_icms)) * $scope.estudo.aliq_icms
            );

            // Cálculo do total de tributos.
            estProd.tributos.declarado.total.usd = (
                estProd.tributos.declarado.ii.usd +
                estProd.tributos.declarado.ipi.usd +
                estProd.tributos.declarado.pis.usd +
                estProd.tributos.declarado.cofins.usd +
                estProd.tributos.declarado.icms.usd
            );

            estProd.tributos.declarado.total.brl = (
                estProd.tributos.declarado.ii.brl +
                estProd.tributos.declarado.ipi.brl +
                estProd.tributos.declarado.pis.brl +
                estProd.tributos.declarado.cofins.brl +
                estProd.tributos.declarado.icms.brl
            );

            estProd.tributos.cheio.total.usd = (
                estProd.tributos.cheio.ii.usd +
                estProd.tributos.cheio.ipi.usd +
                estProd.tributos.cheio.pis.usd +
                estProd.tributos.cheio.cofins.usd +
                estProd.tributos.cheio.icms.usd
            );

            estProd.tributos.cheio.total.brl = (
                estProd.tributos.cheio.ii.brl +
                estProd.tributos.cheio.ipi.brl +
                estProd.tributos.cheio.pis.brl +
                estProd.tributos.cheio.cofins.brl +
                estProd.tributos.cheio.icms.brl
            );

        }

        function totalizaDespesasDoProduto(produto) {

            var estProd = produto.estudo_do_produto; // Simplificando a variável para reduzir o espaço e facilitar a leitura.

            // Cálculo do total de despesas proporcional do produto.
            estProd.despesas.total.brl = (estProd.cif.declarado.brl / $scope.estudo.cif.declarado.brl) * $scope.estudo.despesas.total.brl;
            estProd.despesas.total.usd = estProd.despesas.total.brl / $scope.estudo.cotacao_dolar; // todo: Definir se esta é a melhor forma de calcular este valor.

            estProd.despesas.internacionais.individualizadas.brl = estProd.despesas.internacionais.individualizadas.usd / $scope.config.cotacao_dolar; // todo: Usar estudo.cotação ou config.cotaçao???

        }

        /**
         * Incrementa os totais dos tributos do estudo "geral" com base nos valores de cada produto passado como argumento.
         * @param produto
         */
        function totalizaImpostosEstudo(produto) {

            var estProduto = produto.estudo_do_produto;

            // Update (soma) dos valores dos impostos ao Estudo Geral.

            $scope.estudo.tributos.declarado.ii.brl += estProduto.tributos.declarado.ii.brl;
            $scope.estudo.tributos.declarado.ipi.brl += estProduto.tributos.declarado.ipi.brl;
            $scope.estudo.tributos.declarado.pis.brl += estProduto.tributos.declarado.pis.brl;
            $scope.estudo.tributos.declarado.cofins.brl += estProduto.tributos.declarado.cofins.brl;
            $scope.estudo.tributos.declarado.icms.brl += estProduto.tributos.declarado.icms.brl;
            $scope.estudo.tributos.declarado.total.brl += estProduto.tributos.declarado.total.brl;

            $scope.estudo.tributos.cheio.ii.brl += estProduto.tributos.cheio.ii.brl;
            $scope.estudo.tributos.cheio.ipi.brl += estProduto.tributos.cheio.ipi.brl;
            $scope.estudo.tributos.cheio.pis.brl += estProduto.tributos.cheio.pis.brl;
            $scope.estudo.tributos.cheio.cofins.brl += estProduto.tributos.cheio.cofins.brl;
            $scope.estudo.tributos.cheio.icms.brl += estProduto.tributos.cheio.icms.brl;
            $scope.estudo.tributos.cheio.total.brl += estProduto.tributos.cheio.total.brl;

        }

        /**
         * Calcula os lucros unitário e total do produto passado como parâmetro, em brl.
         * @param produto
         */
        function calculaResultadosPorProduto(produto) {

            var estProd = produto.estudo_do_produto; // Simplificando a variável para reduzir o espaço e facilitar a leitura.

            estProd.resultados.lucro.unitario.brl = (estProd.resultados.precos.venda.brl * (1 - $scope.estudo.config.aliquota_simples - $scope.estudo.config.comissao_ml)) - estProd.resultados.precos.custo.final.brl;
            estProd.resultados.lucro.total.brl = estProd.resultados.lucro.unitario.brl * estProd.qtd;
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

