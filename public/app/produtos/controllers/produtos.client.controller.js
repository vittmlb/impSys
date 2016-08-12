/**
 * Created by Vittorio on 30/05/2016.
 */
angular.module('produtos').controller('ProdutosController', ['$scope', '$routeParams', '$location', 'Produtos', 'Ncms', '$stateParams', '$state', 'Upload', '$window',
    function($scope, $routeParams, $location, Produtos, Ncms, $stateParams, $state, Upload, $window) {

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
        $scope.mockProduto = new Produtos({
            nome: 'Mocking',
            modelo: 'MDB',
            descricao: 'Mocking Produto System',
            custo_usd: 10000,
            ncm: '99.99.99.99',
            impostos: {
                ii: 0.18,
                ipi: 0.15,
                pis: 0.05,
                cofins: 0.02
            },
            medidas: {
                cbm: 0.05,
                peso: 1
            },
            website: 'www.www.com.br',
            notas: 'Aloha'
        });
        $scope.ListaNcms = Ncms.query();
        $scope.ncm = {};
        $scope.parsed_ncm = {};
        $scope.usa_impostos_ncm = true;
        $scope.impostosDoProduto = {};
        
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
                // ncm: parsed_ncm._id,
                ncm: $scope.parsed_ncm._id,
                usa_impostos_ncm: this.usa_impostos_ncm,
                impostos: $scope.impostos,
                medidas: {
                    cbm: this.medidas.cbm,
                    peso: this.medidas.peso
                },
                website: this.website,
                notas: this.notas
            });
            // var produto = $scope.mockProduto;
            var p = $scope.validateForm(produto); // Validates form and uploads image.
            p.then(function(newProduto) {
                newProduto.$save(function (response) {
                    $location.path('/produtos/' + response._id);
                }, function(errorResponse) {
                    console.log(errorResponse);
                    $scope.error = errorResponse.data.message;
                });
            }, function() {
                produto.$save(function (response) {
                    $location.path('/produtos/' + response._id);
                }, function (errorResponse) {
                    console.log(errorResponse);
                    $scope.error = errorResponse.data.message;
                });
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
            if(!$scope.file) {
                $scope.produto.$update(function () {
                    $location.path('/produtos/' + $scope.produto._id);
                }, function(errorResponse) {
                    console.log(errorResponse);
                    $scope.error = errorResponse.data.message;
                });
            } else {
                var p = $scope.validateForm($scope.produto);
                p.then(function (newProduto) {
                    $scope.produto = newProduto;
                    $scope.produto.$update(function (response) {
                        $location.path('/produtos/' + response._id);
                    }, function(errorResponse) {
                        console.log(errorResponse);
                        $scope.error = errorResponse.data.message;
                    });
                });
            }
        };

        $scope.atualizaImpostos = function() {
            if($scope.usa_impostos_ncm) {
                $scope.parsed_ncm = JSON.parse($scope.ncm);
                if($scope.usa_impostos_ncm) {
                    $scope.impostos = $scope.parsed_ncm.impostos;
                }
            }
        };
        $scope.atualizaImpostosEdit = function() {
            if($scope.usa_impostos_ncm) {
                var i = 10;
                // $scope.impostosDoProduto = $scope.produto.ncm.impostos;
                // $scope.produto.impostos.ii = $scope.produto.ncm.impostos.ii;
            } else {
                var j = 10;
            }
        };

        /**
         * Valida formulário e usa Serviço Upload para upar a imagem do produto.
         * @param produto
         * @returns {Promise}
         */
        $scope.validateForm = function(produto) { // todo: implementar validação dos demais dados do formulário. No momento, apenas o arquivo e validado.
            return new Promise(function(resolve) {
                if($scope.form.file.$valid && $scope.file) {
                    return resolve($scope.uploadImage($scope.file, produto));
                } else {
                    return reject();
                }
            });
        };

        $scope.uploadImage = function (thisFile, produto) {
            return Upload.upload({
                url: 'http://localhost:5000/api/uploadimages/produtos', //webAPI exposed to upload the file
                data:{file:thisFile} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: '); //todo: usar ngToast
                    produto.img_url = '/uploads/images/' + resp.data.file_path;
                    return produto;
                } else {
                    console.log(resp);
                    $window.alert('an error occured'); //todo: user ngToast
                    return produto;
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status); //todo: user ngToast
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };

    }
]);
