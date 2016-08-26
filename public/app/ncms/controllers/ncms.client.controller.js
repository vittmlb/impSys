/**
 * Created by Vittorio on 04/08/2016.
 */
angular.module('ncms').controller('NcmsController', ['$scope', '$stateParams', '$location', 'Ncms', 'toaster', 'SweetAlert',
    function($scope, $stateParams, $location, Ncms, toaster, SweetAlert) {
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
        $scope.create = function() {
            var ncm = new Ncms({
                cod_ncm: this.cod_ncm,
                descricao: this.descricao,
                li: this.li,
                impostos: this.impostos,
                obs: this.obs
            });
            ncm.$save(function (response) {
                $location.path('/ncms/' + response._id);
            }, function(errorResponse) {
                console.log(errorResponse);
                $scope.error = errorResponse.data.message; // todo: Sistema de notificação
            });
        };
        $scope.find = function() {
            $scope.ncms = Ncms.query();
        };
        $scope.findOne = function() {
            $scope.ncm = Ncms.get({
                ncmId: $stateParams.ncmId
            });
        };
        $scope.update = function() {
            $scope.ncm.$update(function (response) {
                $location.path('/ncms/' + response._id);
            }, function(errorResponse) {
                console.log(errorResponse);
                $scope.error = errorResponse; // todo: Implantar sistema de notificaçao.
            });
        };
        $scope.delete = function(ncm) {
            if(ncm) {
                ncm.$remove(function () {
                    for(var i in $scope.ncms) {
                        if($scope.ncms[i] === ncm) {
                            $scope.ncms.splice(i, 1);
                        }
                    }
                });
            } else {
                $scope.ncm.$remove(function () {
                    $location.path('/ncms');
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
        $scope.deleteAlert = function(ncm) {
            SweetAlert.swal(SweetAlertOptions.removerNcm,
                function(isConfirm){
                    if (isConfirm) {
                        $scope.delete(ncm);
                        SweetAlert.swal("Removido!", "O NCM foi removido.", "success");
                    } else {
                        SweetAlert.swal("Cancelado", "O Ncm não foi removido :)", "error");
                    }
                });
        };
    }
]);