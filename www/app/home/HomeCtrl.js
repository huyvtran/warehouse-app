'use strict';
/**
 * @ngdoc function
 * @name warehouseApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the warehouseApp
 */
angular.module('warehouseApp')
    .controller('HomeCtrl', function($rootScope, $scope, $http, $state, $location, apiConfig, ConfirmModalDialogService) {

        // 获取当前登录用户
        var originalPath = $location.path();

        if (window.sessionStorage['userRealName']) {
            $rootScope.userName = window.sessionStorage['userRealName'];
        } else {
            $http.get(apiConfig.host + "/admin/api/admin-user/me")
            .success(function (data, status) {
                $rootScope.userName = data.realname;

                window.sessionStorage['userRealName'] = data.realname;

                $location.path(originalPath);
            })
            .error(function (data, status) {
                ConfirmModalDialogService.AsyncAlert("获取登录用户失败");
            })
        }

        // 退出登录
        $scope.logout = function () {
            ConfirmModalDialogService.AsyncConfirmYesNo(
                "确定退出登录？", 
                function() {
                    $http({
                        url: apiConfig.host + "/admin/api/logout",
                        method: 'GET'
                    })
                    .success(function (data, status) {
                        delete $rootScope.user;

                        window.localStorage.removeItem('cachedUsername');
                        window.localStorage.removeItem('password');

                        window.sessionStorage.removeItem('userRealName');

                        $state.go("login");
                    })
                    .error(function (data, status) {
                        ConfirmModalDialogService.AsyncAlert("退出异常");
                    })
                }
            );
        }
        
    });
