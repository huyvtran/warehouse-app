'use strict';
/**
 * @ngdoc function
 * @name warehouseApp.controller:OrderGroupDetailCtrl
 * @description
 * # OrderGroupDetailCtrl
 * Controller of the warehouseApp
 */
angular.module('warehouseApp')
    .controller('OrderGroupDetailCtrl', function($scope, $stateParams, $http, $state, apiConfig, ConfirmModalDialogService, OrderGroupSkuService) {

        $(document).ready(function() {
            $("#check-barcode-input").focus();
        });

        var beepTimes = 2;

        $scope.displayOrderGroupsSkus = [];
        $scope.isCommitState = false;

        // 获取订单包详情 
    	if ($stateParams.orderGroupId && $stateParams.isPopStashSkus === "false") {
            var popStashSkusObj = OrderGroupSkuService.getStashCheckedGroupSkus($stateParams.orderGroupId);

            if (popStashSkusObj && $stateParams.orderGroupId == popStashSkusObj.orderGroupId) {
                ConfirmModalDialogService.AsyncAlert("该车货品是暂存状态还未提交出库！");

                $scope.orderGroupId = popStashSkusObj.orderGroupId;

                $scope.trackerName = popStashSkusObj.trackerName;

                $scope.members = popStashSkusObj.members;

                $scope.displayOrderGroupsSkus = popStashSkusObj.stashCheckedGroupSkus;
            } else {
                $http.get(apiConfig.host + "/admin/api/v2/order-group/" + $stateParams.orderGroupId)
                    .success(function (data, status) {
                        $scope.orderGroup = data;
                        // console.log(data);

                        $scope.orderGroupId = $stateParams.orderGroupId;
                        $scope.trackerName = $scope.orderGroup.stockOutGroupWrapper.tracker;
                        $scope.members = $scope.orderGroup.stockOutGroupWrapper.members;

                        if (data.orderGroupsSkuTotals && data.orderGroupsSkuTotals.length > 0) {
                            for (var i=0; i < data.orderGroupsSkuTotals.length; i++) {
                                var orderGroupSku = data.orderGroupsSkuTotals[i];

                                $scope.displayOrderGroupsSkus.push({
                                    skuId: orderGroupSku.sku.id,
                                    skuName: orderGroupSku.sku.name,
                                    price: orderGroupSku.price,
                                    quantity: orderGroupSku.quantity,
                                    checkQuantity: null
                                })
                            }
                        }
                        // console.log($scope.displayOrderGroupsSkus);
                    })
                    .error(function (data, status) {
                        ConfirmModalDialogService.AsyncAlert("获取订单包详情失败");
                    })
            }    		
    	}

        // 补充扫描－取回暂存数据
        if ($stateParams.isPopStashSkus === "true" && $stateParams.orderGroupId) {
            var popStashSkusObj = OrderGroupSkuService.getStashCheckedGroupSkus($stateParams.orderGroupId);

            $scope.orderGroupId = popStashSkusObj.orderGroupId;

            $scope.trackerName = popStashSkusObj.trackerName;

            $scope.members = popStashSkusObj.members;

            $scope.displayOrderGroupsSkus = popStashSkusObj.stashCheckedGroupSkus;
        }

        // 核对商品条形码
        $scope.barcode = ""; // 23007X1429X2   23771X1430X3

        $scope.addToCheck = function () {
            if ($scope.barcode === "") {
                return;
            } else {    
                var skuId = parseInt($scope.barcode.split("X")[0]);
                var orderId = parseInt($scope.barcode.split("X")[1]);
                var _quantity = parseInt($scope.barcode.split("X")[2]);

                if (typeof orderId == "undefined" || isNaN(orderId)) {
                    navigator.notification.beep(beepTimes);
                    ConfirmModalDialogService.AsyncAlert("非法的商品条码！");
                    $scope.barcode = "";
                    return;
                } else {
                    var tag = false;
                    var orderMembers = $scope.members;

                    if (orderMembers && orderMembers.length > 0) {
                        for (var i=0; i < orderMembers.length; i++) {
                            if (orderMembers[i].id === orderId) {
                                tag = true;
                            }
                        }
                    }

                    if (tag) {
                        if ($scope.displayOrderGroupsSkus.length > 0) {
                            var stamp = true;

                            for (var i=0; i < $scope.displayOrderGroupsSkus.length; i++) {
                                if ($scope.displayOrderGroupsSkus[i].skuId === skuId) {
                                    if ($scope.displayOrderGroupsSkus[i].quantity === null) {
                                        $scope.displayOrderGroupsSkus[i].quantity = 0;
                                    }

                                    if ($scope.displayOrderGroupsSkus[i].quantity < $scope.displayOrderGroupsSkus[i].checkQuantity+1) {
                                        navigator.notification.beep(beepTimes);
                                        ConfirmModalDialogService.AsyncAlert("该商品数量已超过订单包中实际数量！");
                                        $scope.barcode = "";
                                        return;
                                    } else {
                                        $scope.displayOrderGroupsSkus[i].checkQuantity += _quantity;
                                    }

                                    stamp = false;
                                }
                            }

                            if (stamp) {
                                navigator.notification.beep(beepTimes);
                                ConfirmModalDialogService.AsyncAlert("该商品不在此订单包中！");
                                $scope.barcode = "";
                                return;
                            }
                        }
                    } else {
                        navigator.notification.beep(beepTimes);
                        ConfirmModalDialogService.AsyncAlert("该商品不在此订单包中！");
                        $scope.barcode = "";
                        return;
                    }
                }
            }

            $scope.barcode = "";
        }
 
        // 提交校验
        $scope.commitCheck = function () {
            ConfirmModalDialogService.AsyncConfirmYesNo(
                "确认提交验货校验？", 
                function() {
                    var success = true;
                    var checkFalureSkus = [];

                    for (var i=0; i < $scope.displayOrderGroupsSkus.length; i++) {
                        var quantity = $scope.displayOrderGroupsSkus[i].quantity;
                        var checkQuantity = $scope.displayOrderGroupsSkus[i].checkQuantity;

                        if (quantity === checkQuantity) {
                            // console.log("刚好：");
                            // console.log($scope.displayOrderGroupsSkus[i]);
                        } else if (checkQuantity === null) {
                            success = false;

                            // console.log("没拿：");
                            // console.log($scope.displayOrderGroupsSkus[i]);

                            checkFalureSkus.push($scope.displayOrderGroupsSkus[i]);
                        } else if (quantity > checkQuantity) {
                            success = false;

                            // console.log("少了：");
                            // console.log($scope.displayOrderGroupsSkus[i]);

                            checkFalureSkus.push($scope.displayOrderGroupsSkus[i]);
                        } else if (quantity < checkQuantity) {
                            success = false;

                            // console.log("多了：");
                            // console.log($scope.displayOrderGroupsSkus[i]);

                            checkFalureSkus.push($scope.displayOrderGroupsSkus[i]);
                        }
                    }

                    if (success) {
                        $scope.isCommitState = true;
                        var stockOutIds = [];
                        var skus = [];

                        for (var i=0; i < $scope.members.length; i++) {
                            stockOutIds.push($scope.members[i].id);
                        }

                        for (var i=0; i < $scope.displayOrderGroupsSkus.length; i++) {
                            var skuId = $scope.displayOrderGroupsSkus[i].skuId;
                            var checkQuantity = $scope.displayOrderGroupsSkus[i].checkQuantity;

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
                            url: apiConfig.host + "/admin/api/v2/update/checkResult/" + $scope.orderGroupId,
                            method: "PUT",
                            config: {
                                timeout: 600000
                            },
                            data: $scope.postData,
                            headers: {'Content-Type' : 'application/json;charset=UTF-8'}
                        })
                        .success(function (data, status) {
                            $scope.isCommitState = false;

                            $state.go('check-result',{
                                orderGroupId : $scope.orderGroupId,
                                result : "success"
                            });
                        })
                        .error(function (data, status) {
                            $scope.isCommitState = false;

                            if (data)
                                ConfirmModalDialogService.AsyncAlert("校验提交失败:"+ data.errmsg);    
                            else
                                ConfirmModalDialogService.AsyncAlert("校验提交失败");
                        });
                    } else {
                        OrderGroupSkuService.setCheckFalureSkus(checkFalureSkus);

                        OrderGroupSkuService.setStashCheckedGroupSkus($scope.orderGroupId, $scope.trackerName, $scope.members, $scope.displayOrderGroupsSkus);

                        $state.go('check-result',{
                            orderGroupId : $scope.orderGroupId,
                            result : "falure"
                        });
                    }
                    
                }
            );
        };

        // 重置校验数量
        $scope.resetCheckQuantity = function () {
            ConfirmModalDialogService.AsyncConfirmYesNo(
                "确认重置所有商品验货数量？", 
                function() {
                    for (var i=0; i < $scope.displayOrderGroupsSkus.length; i++) {
                        $scope.displayOrderGroupsSkus[i].checkQuantity = null;

                        $scope.$apply();
                    }
                }
            );
        };

        // 暂存已经扫描过的货品
        $scope.stashUncommitedSkus = function () {
            ConfirmModalDialogService.AsyncConfirmYesNo(
                "确认暂存该车所验货品？", 
                function() {
                    OrderGroupSkuService.setStashCheckedGroupSkus($scope.orderGroupId, $scope.trackerName, $scope.members, $scope.displayOrderGroupsSkus);

                    ConfirmModalDialogService.AsyncAlert("暂存成功！");
                }
            );
        };

    });
