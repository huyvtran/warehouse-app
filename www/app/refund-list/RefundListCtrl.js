'use strict';
/**
 * @ngdoc function
 * @name warehouseApp.controller:RefundListCtrl
 * @description
 * # RefundListCtrl
 * Controller of the warehouseApp
 */
angular.module('warehouseApp')
    .controller('RefundListCtrl', function($scope, $http, $state, apiConfig, ConfirmModalDialogService) {
        
        $(document).ready(function() {
            $("#barcode-input").focus();
        });

        var beepTimes = 2;

    	// 退货商品条形码
    	$scope.barcode = ""; //   14925X106775   13940X106775    14841X106775
        // 展示商品列表
        $scope.displayRefundSkus = [];

        $scope.hasGottonOrder = false;

        $scope.isCommitState = false;

        // 添加退货
    	$scope.addRefundSku = function () {
    		if ($scope.barcode === "") {
    			return;
    		} else {
                var skuId = parseInt($scope.barcode.split("X")[0]);
                var orderId = parseInt($scope.barcode.split("X")[1]);

                if (orderId && typeof orderId != "undefined" && orderId === $scope.firstCodeOrderId 
                    && $scope.hasGottonOrder) {
                    if ($scope.orderItems && $scope.orderItems.length > 0) {
                        var stamp = true;

                        for (var i=0; i < $scope.orderItems.length; i++) {
                            if ($scope.orderItems[i].sku.id === skuId) {
                                stamp = false;
                                var tag = true; 

                                for (var j=0; j < $scope.displayRefundSkus.length; j++) {
                                    if ($scope.displayRefundSkus[j].skuId == skuId) {
                                        if ($scope.displayRefundSkus[j].saleQuantity < $scope.displayRefundSkus[j].quantity+1) {
                                            navigator.notification.beep(beepTimes);
                                            ConfirmModalDialogService.AsyncAlert("退货数量已超过实际购买数量！");
                                            $scope.barcode = "";
                                            return;
                                        } else {
                                            $scope.displayRefundSkus[j].quantity += 1;
                                        }

                                        tag = false;
                                    }
                                }

                                if (tag) {
                                    var orderItem = $scope.orderItems[i];

                                    $scope.displayRefundSkus.push({
                                        skuId: orderItem.sku.id,
                                        name: orderItem.sku.name,
                                        price: orderItem.price,
                                        saleQuantity: orderItem.quantity,
                                        quantity: 1
                                    });

                                    $scope.barcode = "";
                                    return;
                                }
                            }
                        }

                        if (stamp) {
                            navigator.notification.beep(beepTimes);
                            ConfirmModalDialogService.AsyncAlert("当前订单中无此商品！");
                            $scope.barcode = "";
                            return;
                        }
                    }
                } else if ($scope.hasGottonOrder && (typeof orderId == "undefined" || isNaN(orderId))) {
                    navigator.notification.beep(beepTimes);
                    ConfirmModalDialogService.AsyncAlert("非法的商品条码！");
                    $scope.barcode = "";
                    return;
                } else if (orderId && typeof orderId != "undefined" && orderId != $scope.firstCodeOrderId 
                    && $scope.hasGottonOrder) {
                    navigator.notification.beep(beepTimes);
                    ConfirmModalDialogService.AsyncAlert("该商品与前一个商品不属同一订单，请提交退货后再扫描！");
                    $scope.barcode = "";
                    return;
                }

                if (orderId && typeof orderId != "undefined" && !$scope.hasGottonOrder) {
                    $scope.firstCodeOrderId = orderId;
                } else if (!$scope.hasGottonOrder && (typeof orderId == "undefined" || isNaN(orderId))) {
                    navigator.notification.beep(beepTimes);
                    ConfirmModalDialogService.AsyncAlert("非法的商品条码！");
                    $scope.barcode = "";
                    return;
                }

    			if ($scope.firstCodeOrderId && typeof $scope.firstCodeOrderId != 'undefined'
                    && !$scope.hasGottonOrder) {
		    		$http.get(apiConfig.host + "/admin/api/order/" + $scope.firstCodeOrderId)
		    			.success(function (data, status) {
		    				$scope.order = data;

                            $scope.orderItems = data.orderItems;

                            if ($scope.orderItems && $scope.orderItems.length > 0) {
                                for (var i=0; i < $scope.orderItems.length; i++) {
                                    if ($scope.orderItems[i].sku.id === skuId) {
                                        var orderItem = $scope.orderItems[i];

                                        $scope.displayRefundSkus.push({
                                            skuId: orderItem.sku.id,
                                            name: orderItem.sku.name,
                                            price: orderItem.price,
                                            saleQuantity: orderItem.quantity,
                                            quantity: 1
                                        });
                                    }
                                }
                            }

                            $scope.hasGottonOrder = true;
		    			})
		    			.error(function (data, status) {
                            ConfirmModalDialogService.AsyncAlert("获取订单详情失败");
		    			})
    			}

    		}

    		$scope.barcode = "";
    	};

        // 拨打客服电话
    	$scope.callCustomer = function (telephone) {
            ConfirmModalDialogService.AsyncConfirmYesNo(
                "确认拨打电话：" + telephone, 
                function() {
                    window.open('tel:' + telephone, '_system');
                }
            );
    	};

        // 退货数据包
        $scope.refundObj = {
            reasonId : null,
            skuRefundRequests : []
        };

        // 获取退货原因
        $http.get(apiConfig.host + "/admin/api/order/refund/reason")
            .success(function (data, status) {
                $scope.reasons = data;
            }).error(function (data, status) {
                ConfirmModalDialogService.AsyncAlert("获取退货原因失败!");
            });

        // 提交退货
    	$scope.commitRefund = function () {
            if (!$scope.refundObj.reasonId) {
                ConfirmModalDialogService.AsyncAlert("请选择退货原因!");
                return;
            }

            ConfirmModalDialogService.AsyncConfirmYesNo(
                "确认提交退货？", 
                function() {
                    $scope.isCommitState = true;

                    if ($scope.displayRefundSkus.length == 0) {
                        ConfirmModalDialogService.AsyncAlert("暂无退货商品！");
                        return;
                    } else {
                        var tag = true;

                        for (var i=0; i < $scope.displayRefundSkus.length; i++) {
                            var quantity = $scope.displayRefundSkus[i].quantity;

                            if (quantity === 0 || quantity == null) {
                                tag = false;
                            }
                        }

                        if (tag) {
                            $scope.refundObj.skuRefundRequests = $scope.displayRefundSkus;
                            
                            $http({
                                url: apiConfig.host + "/admin/api/order/refund/" + $scope.order.id,
                                method: "POST",
                                data: $scope.refundObj
                            }).success(function (data, status) {
                                $state.go('refund-result',{resultStatus: 1});

                                $scope.isCommitState = false;
                            }).error(function (data, status) {
                                ConfirmModalDialogService.AsyncAlert(data.errmsg);

                                $state.go('refund-result',{resultStatus: 0});

                                $scope.isCommitState = false;
                            });
                        } else {
                            ConfirmModalDialogService.AsyncAlert("退货数量不能为0或为空!");
                            return;
                        }
                    }
                }
            );
    	};

        // 重置退货数量
        $scope.resetRefundQuantity = function () {
            ConfirmModalDialogService.AsyncConfirmYesNo(
                "确认重置所有退货数量？", 
                function() {
                    for (var i=0; i < $scope.displayRefundSkus.length; i++) {
                        $scope.displayRefundSkus[i].quantity = null;

                        $scope.$apply();
                    }
                }
            );
        };

    });
