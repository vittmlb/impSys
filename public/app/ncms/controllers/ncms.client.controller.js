/**
 * Created by Vittorio on 04/08/2016.
 */
angular.module('ncms').controller('NcmsController', ['$scope', '$stateParams', '$location', 'Ncms',
    function($scope, $stateParams, $location, Ncms) {
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
                $scope.error = errorResponse.data.message; // todo: Implantar sistema de notificaçao.
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
                });
            }
        };
    }
]);