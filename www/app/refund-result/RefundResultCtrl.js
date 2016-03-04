'use strict';
/**
 * @ngdoc function
 * @name warehouseApp.controller:RefundResultCtrl
 * @description
 * # RefundResultCtrl
 * Controller of the warehouseApp
 */
angular.module('warehouseApp')
    .controller('RefundResultCtrl', function($scope, $stateParams) {

    	if ($stateParams.resultStatus) {
    		$scope.resultStatusValue = $stateParams.resultStatus;
    		// console.log($scope.resultStatusValue);
    	}

    });
