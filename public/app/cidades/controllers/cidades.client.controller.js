/**
 * Created by Vittorio on 14/08/2016.
 */
angular.module('cidades').controller('CidadesController', ['$scope', '$stateParams', '$location', 'Cidades', 'Estados',
    function($scope, $stateParams, $location, Cidades, Estados) {
        var SweetAlertOptions = {
            removerNcm: {
                title: "Deseja remover o NCM?",
                text: "Você não poderá mais recuperá-lo!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Sim, remover!",
                cancelButtonText: "Não, cancelar!",
                closeOnConfirm: false,
                closeOnCancel: false }
        };
        $scope.ListaEstados = Estados.query();
        $scope.create = function() {
            var cidade = new Cidades({
                nome_cidade: this.nome_cidade,
                estado_cidade: this.estado_cidade
            });
            cidade.$save(function (response) {
                $location.path('/cidades/' + response._id);
            }, function(errorResponse) {
                console.log(errorResponse);
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.find = function() {
            $scope.cidades = Cidades.query();
        };
        $scope.findOne = function() {
            $scope.cidade = Cidades.get({
                cidadeId: $stateParams.cidadeId
            });
        };
        $scope.update = function() {
            $scope.cidade.$update(function (response) {
                $location.path('/cidades/' + response._id);
            }, function(errorResponse) {
                console.log(errorResponse);
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.delete = function(cidade) {
            if(cidade) {
                cidade.$remove(function () {
                    for(var i in $scope.cidades) {
                        if($scope.cidades[i] === cidade) {
                            $scope.cidades.splice(i, 1);
                        }
                    }
                });
            } else {
                $scope.cidade.$remove(function () {
                    $location.path('/cidades');
                }, function(errorResponse) {
                    console.log(errorResponse);
                    $scope.error = errorResponse.data.message;
                });
            }
        };

        $scope.deleteAlert = function(cidade) {
            SweetAlert.swal(SweetAlertOptions.removerNcm,
                function(isConfirm){
                    if (isConfirm) {
                        $scope.delete(cidade);
                        SweetAlert.swal("Removido!", "A Cidade foi removida.", "success");
                    } else {
                        SweetAlert.swal("Cancelado", "A Cidade não foi removida :)", "error");
                    }
                });
        };

    }
]);