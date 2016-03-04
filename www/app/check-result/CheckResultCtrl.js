'use strict';
/**
 * @ngdoc function
 * @name warehouseApp.controller:CheckResultCtrl
 * @description
 * # CheckResultCtrl
 * Controller of the warehouseApp
 */
angular.module('warehouseApp')
    .controller('CheckResultCtrl', function($scope, $stateParams, $http, $state, apiConfig, OrderGroupSkuService, ConfirmModalDialogService) {

    	if ($stateParams.orderGroupId) {
    		$scope.orderGroupId = $stateParams.orderGroupId;
    	}	

    	if ($stateParams.result) {
    		$scope.result = $stateParams.result;

    		if ($stateParams.result === "falure") {
    			$scope.displayCheckFalureSkus = OrderGroupSkuService.getCheckFalureSkus();
    		}
    	}

        window.location.href = "#";

        $scope.manCommit = function () {
            ConfirmModalDialogService.AsyncConfirmYesNo(
                "确认所有商品核对无误？", 
                function() {
                    var stockOutIds = [];
                    var skus = [];

                    var popStashSkusObj = OrderGroupSkuService.getStashCheckedGroupSkus($stateParams.orderGroupId);

                    for (var i=0; i < popStashSkusObj.members.length; i++) {
                        stockOutIds.push(popStashSkusObj.members[i].id);
                    }

                    for (var i=0; i < popStashSkusObj.stashCheckedGroupSkus.length; i++) {
                        var skuId = popStashSkusObj.stashCheckedGroupSkus[i].skuId;
                        var checkQuantity = popStashSkusObj.stashCheckedGroupSkus[i].checkQuantity;

                        if (checkQuantity === null) {
                            checkQuantity = 0;
                        }   

                        skus.push({skuId: skuId, realQuantity: checkQuantity});
                    }

                    $scope.postData = {
                        stockOutIds : stockOutIds,
                        stockOutItems : skus
                    };

                    $http({
                        url: apiConfig.host + "/admin/api/v2/update/checkResult/" + $stateParams.orderGroupId,
                        method: "PUT",
                        config: {
                            timeout: 600000
                        },
                        data: $scope.postData,
                        headers: {'Content-Type' : 'application/json;charset=UTF-8'}
                    })
                    .success(function (data, status) {
                        ConfirmModalDialogService.AsyncAlert("提交成功，该车已出库");

                        $state.go('order-group-list');
                    })
                    .error(function (data, status) {
                        if (data)
                            ConfirmModalDialogService.AsyncAlert("提交失败:" + data.errmsg);    
                        else
                            ConfirmModalDialogService.AsyncAlert("提交失败");
                    });
                }
            );
        };

        $scope.backToCheck = function () {
            ConfirmModalDialogService.AsyncConfirmYesNo(
                "确认返回继续补充扫描？", 
                function() {
                    $state.go('order-group-detail', {
                        isPopStashSkus : true,
                        orderGroupId: $stateParams.orderGroupId
                    });
                }
            );
        };

    });
