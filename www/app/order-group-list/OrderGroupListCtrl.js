'use strict';
/**
 * @ngdoc function
 * @name warehouseApp.controller:OrderGroupListCtrl
 * @description
 * # OrderGroupListCtrl
 * Controller of the warehouseApp
 */
angular.module('warehouseApp')
    .controller('OrderGroupListCtrl', function($scope, $http, apiConfig, ConfirmModalDialogService) {
    	
        $scope.dataObj = {
            tracker: ""
        };

    	$scope.getOrderGroups = function () {
            $http({
                url: apiConfig.host + "/admin/api/v2/order-group",
                method: "GET",
                params: {
                    trackerName: $scope.dataObj.tracker
                }
            })
            .success(function (data, status) {
                $scope.orderGroups = data;

                // console.log(data);
            })
            .error(function (data, status) {
                ConfirmModalDialogService.AsyncAlert("获取订单包失败");
            })
        };

        $scope.getOrderGroups();

        $scope.toQueryByTracker = function () {
             $scope.getOrderGroups();
        };

        $scope.$watch('dataObj.tracker', function (newVal) {
            if (typeof newVal != "undefined" && newVal != "" && newVal != null) {
                $scope.hasQuery = true;
            } else {
                $scope.hasQuery = false;
            }
        })

        $scope.clearQuery = function () {
            $scope.dataObj.tracker = "";
        };
    });
