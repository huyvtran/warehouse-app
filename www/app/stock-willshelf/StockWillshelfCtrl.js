'use strict';
/**
 * @ngdoc function
 * @name warehouseApp.controller:StockWillshelfCtrl
 * @description
 * # StockWillshelfCtrl
 * Controller of the warehouseApp
 */
angular.module('warehouseApp')
    .controller('StockWillshelfCtrl', function($scope, $http, $location, $stateParams, $state, apiConfig, ConfirmModalDialogService) {

    	$scope.stockSearchForm = {
    		cityId: $stateParams.cityId,
    		depotId: $stateParams.depotId,
            skuName: $stateParams.skuName,
    		page : $stateParams.page,
            pageSize : $stateParams.pageSize
    	};

        $scope.page = {itemsPerPage : 30};

        $http.get(apiConfig.host + "/admin/api/v2/cities").success(function (data) {
        	$scope.cities = data;

        	if (data && data.length === 1) {
               $scope.stockSearchForm.cityId = data[0].id;
            }
        });

        $scope.$watch('stockSearchForm.cityId', function (newVal, oldVal) {
            if (newVal != null && newVal != "") {
                $http.get(apiConfig.host + "/admin/api/v2/depotList/" + newVal).success(function (data) {
                    $scope.depots = data;

                    if ($scope.depots && $scope.depots.length == 1) {
                       $scope.stockSearchForm.depotId = $scope.depots[0].id;
                    }
                });

                if (typeof oldVal != "undefined" && newVal != oldVal) {
                    $scope.stockSearchForm.depotId = null;
                }
            } else {
                $scope.depots = [];
                $scope.stockSearchForm.depotId = null;
            }
        });

        function search(){
            $http({
                url: apiConfig.host + "/admin/api/stock/willShelfList",
                method: "GET",
                params: $scope.stockSearchForm,
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            }).success(function (data, status, headers, config) {
                $scope.stocks = data.content;

                $scope.page.itemsPerPage = data.pageSize;
                $scope.page.totalItems = data.total;
                $scope.page.currentPage = data.page + 1;
            }).error(function (data, status) {
                ConfirmModalDialogService.AsyncAlert("获取数据失败...");
            });
            $scope.stockSearchForm.pageSize = $scope.page.itemsPerPage;
        }



        search();
        $scope.resetPageAndSearch = function () {
            $scope.stockSearchForm.page = 0;
            $scope.stockSearchForm.pageSize = 30;

            $location.search($scope.stockSearchForm);
        };

        $scope.pageChanged = function() {
            $scope.stockSearchForm.page = $scope.page.currentPage - 1;
            $scope.stockSearchForm.pageSize = $scope.page.itemsPerPage;

            //$location.search($scope.stockSearchForm);
            search();
        }

        $scope.$watch('stock.shelfCode', function (newVal) {
            if (typeof newVal != "undefined" && newVal != "" && newVal != null) {
                $scope.hasCode = true;
            } else {
                $scope.hasCode = false;
            }
        })

        $scope.clearCode = function () {
            $scope.stock.shelfCode = null;
        };

        $scope.searchShelfName = function (code) {
            if(code != null && code != "") {
                $scope.shelfForm = {
                    depotId: $scope.stock.depotId,
                    shelfCode: code
                };

                $http({
                    url: apiConfig.host + '/admin/api/shelf/code',
                    method: 'GET',
                    params: $scope.shelfForm
                })
                .success(function (data, status) {
                    if (data != null && data != '') {
                        $scope.stock.shelfName = data.name;
                        $scope.stock.shelfId = data.id;
                        $scope.tipMsg = "";
                    } else{
                        $scope.stock.shelfName = null;
                        $scope.stock.shelfId = null;
                        $scope.tipMsg = "货位不存在！";
                    }
                })
                .error(function (data) {
                	alert("查询异常");
                    return;
                });
            }
        };

        $scope.toConfirmYesNo = function (stock) {
		    var $confirm = $("#modalConfirm");
		    $confirm.modal('show');

            $confirm.on('shown.bs.modal', function (e) {
                $("#shelf_code").focus();
            });

		    $scope.stock = stock;
		    $scope.stock.quantity = stock.availableQuantity;

		    $("#btnNoConfirmYesNo").off('click').click(function () {
		        $confirm.modal("hide");
		    });

		    $("#btnYesConfirmYesNo").off('click').click(function () {
		    	if (!angular.isNumber($scope.stock.quantity)) {
	                alert('请输入有效的数量！');
	                return;
	            }
	            if ($scope.stock.quantity <= 0) {
	                alert('数量必须大于0！');
	                return;
	            }
	            if ($scope.stock.quantity > $scope.stock.availableQuantity) {
	                alert('实际数量不能大于待上架数量！');
	                return;
	            }

	            $scope.stockForm = {
		            depotId: $scope.stock.depotId,
		            skuId: $scope.stock.skuId,
		            availableQuantity: $scope.stock.availableQuantity,
		            expirationDate: $scope.stock.expirationDate,
		            stockShelfs: []
		        };

		        var code = "";
	            if ($scope.stock.shelfName.length >= 2) {
	                code += $scope.stock.shelfName.substring(0,2);
	            }
	            if ($scope.stock.shelfName.length >= 5) {
	                code += $scope.stock.shelfName.substring(3,5);
	            }
	            if ($scope.stock.shelfName.length >= 8) {
	                code += $scope.stock.shelfName.substring(6,8);
	            }

	            $scope.stockForm.stockShelfs.push({
	                shelfId: $scope.stock.shelfId,
	                shelfCode: code,
	                quantity: $scope.stock.quantity
	            });

	            $http({
	                url: apiConfig.host + '/admin/api/stock/onShelf',
	                method: 'POST',
	                data: $scope.stockForm,
	                headers: {'Content-Type': 'application/json;charset=UTF-8'}
	            })
	            .success(function (data, status) {
					$confirm.modal("hide");

					alert('上架成功!');

					$confirm.on('hidden.bs.modal', function (e) {
						$http({
				            url: apiConfig.host + "/admin/api/stock/willShelfList",
				            method: "GET",
				            params: $scope.stockSearchForm,
				            headers: {'Content-Type': 'application/json;charset=UTF-8'}
				        }).success(function (data, status, headers, config) {
				            $scope.stocks = data.content;

				            $scope.page.itemsPerPage = data.pageSize;
				            $scope.page.totalItems = data.total;
				            $scope.page.currentPage = data.page + 1;
				        });
					})
	            })
	            .error(function (data, status) {
	                var errMsg = '';

	                if (data != null && data.errmsg != null) {
	                    errMsg = data.errmsg + ',';
	                }

	                alert(errMsg + "上架失败...");
	            });
		    });
		};


    });