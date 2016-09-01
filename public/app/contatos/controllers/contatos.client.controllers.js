/**
 * Created by Vittorio on 01/09/2016.
 */
angular.module('contatos').controller('ContatosController', ['$scope', '$stateParams', '$location', 'Contatos', 'Fornecedores', 'toaster', 'SweetAlert',
    function($scope, $stateParams, $location, Contatos, Fornecedores, toaster, SweetAlert) {
        var SweetAlertOptions = {
            removerContato: {
                title: "Deseja remover o Contato?",
                text: "Você não poderá mais recuperá-lo!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Sim, remover!",
                cancelButtonText: "Não, cancelar!",
                closeOnConfirm: false,
                closeOnCancel: false }
        };
        $scope.email = {};
        $scope.listaEmails = [];
        $scope.listaFornecedores = Fornecedores.query();

        $scope.create = function() {
            var contato = new Contatos({
                nome_contato: this.nome_contato,
                emails: this.listaEmails,
                fornecedor: this.fornecedor
            });
            contato.$save(function (response) {
                $location.path('/contatos/' + response._id);
            }, function(errorResponse) {
                console.log(errorResponse);
                toaster.pop({
                    type: 'error',
                    title: 'Erro',
                    body: errorResponse.data,
                    timeout: 4000
                });
            });
        };
        $scope.find = function() {
            $scope.contatos = Contatos.query();
        };
        $scope.findOne = function() {
            $scope.contato = Contatos.get({
                contatoId: $stateParams.contatoId
            });
        };
        $scope.update = function() {
            $scope.contato.$update(function (response) {
                $location.path('/contatos/' + response._id);
            }, function(errorResponse) {
                toaster.pop({
                    type: 'error',
                    title: 'Erro',
                    body: errorResponse.data.message,
                    timeout: 4000
                });
            });
        };
        $scope.delete = function(contato) {
            if(contato) {
                contato.$remove(function () {
                    for(var i  in $scope.contatos) {
                        if($scope.contatos[i] === contato) {
                            $scope.contatos.splice(i, 1);
                        }
                    }
                }, function(errorResponse) {
                    toaster.pop({
                        type: 'error',
                        title: 'Erro',
                        body: errorResponse.data.message,
                        timeout: 4000
                    });
                });
            } else {
                $scope.contato.$remove(function () {
                    $location.path('/contatos');
                }, function(errorResponse) {
                    toaster.pop({
                        type: 'error',
                        title: 'Erro',
                        body: errorResponse.data.message,
                        timeout: 4000
                    });
                });
            }
        };
        $scope.deleteAlert = function(contato) {
            SweetAlert.swal(SweetAlertOptions.removerContato,
                function(isConfirm){
                    if (isConfirm) {
                        $scope.delete(contato);
                        SweetAlert.swal("Removido!", "O Contato foi removido.", "success");
                    } else {
                        SweetAlert.swal("Cancelado", "O Contato não foi removido :)", "error");
                    }
                });
        };

        $scope.addExtraEmail = function() {
            $scope.listaEmails.push($scope.email);
            $scope.email = {};
        };

    }
]);