'use strict';
/**
 * @ngdoc overview
 * @name warehouseApp
 * @description
 * # warehouseApp
 *
 * Main module of the application.
 */
angular
	.module('warehouseApp', [
        'ionic',
        'templatesCache',
        'ngCordova',
        'oc.lazyLoad',
        'angular-loading-bar',
        'ui.router',
        'ui.bootstrap',
        'ngTouch'
    ])
    .constant('apiConfig', {
        "host": "http://warehouse.canguanwuyou.cn"
         //"host": "http://139.129.15.29"  //线上
         //"host": "http://115.28.64.174"  //测试
        // "host": ""  //本地
        // "environment": "develop"
    })
    .run(function ($ionicPlatform, $cordovaFile, $cordovaFileOpener2, $cordovaFileTransfer, $timeout, ConfirmModalDialogService,$state,UpdateService,NetworkUtil) {
        $ionicPlatform.ready(function () {
            if (ionic.Platform.isAndroid()) {

                cordova.getAppVersion.getVersionCode(function (versionCode) {
                    var newVersionCode = 18;
                    if (versionCode < newVersionCode) {
                        ConfirmModalDialogService.AsyncConfirmYesNo("版本有更新，是否需要升级？",
                            function () {
                                var url = "http://download.canguanwuyou.cn/download/cgwy_warehouse.apk";
                                var targetPath = cordova.file.externalApplicationStorageDirectory + 'cgwy/cgwy_warehouse_' + newVersionCode + '.apk';
                                var trustHosts = true;
                                var options = {};
                                $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                                    .then(function (result) {
                                        // 打开下载下来的APP
                                        $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive')
                                            .then(function () {
                                            }, function (err) {
                                                ConfirmModalDialogService.AsyncAlert("文件打开失败，请稍后重试！");
                                            });
                                    }, function (err) {
                                        ConfirmModalDialogService.AsyncAlert("当前网络不稳定,下载失败!");
                                    }, function (progress) {
                                        $timeout(function () {
                                            var downloadProgress = (progress.loaded / progress.total) * 100;
                                            var msg = "已经下载:" + Math.floor(downloadProgress) + "%";
                                            ConfirmModalDialogService.AsyncDialogShow("下载进度" , msg);
                                            if (downloadProgress >= 99) {
                                                ConfirmModalDialogService.AsyncDialogHide();
                                            }
                                        })
                                    });
                            }
                        );
                    } else {

                        if (NetworkUtil.getNetworkRs()) {
                            var updateObject = function () {
                                UpdateService.updateApp().then(function (result) {
                                    if (result == 2) {
                                        ConfirmModalDialogService.AsyncConfirmYesNo("数据更新失败是否需要重试?",
                                        function(){
                                            updateObject();
                                        });
                                    }
                                });
                            }
                            updateObject();
                        }
                    }
                });

            }
        });
    })
	.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$locationProvider', '$httpProvider', '$provide',
        function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $locationProvider, $httpProvider, $provide) {

            $ocLazyLoadProvider.config({
                debug: false,
                events: true
            });

            $urlRouterProvider.otherwise('/login');

            $httpProvider.interceptors.push(function ($q, $rootScope, $location) {
                return {
                    'responseError': function (rejection) {
                        var status = rejection.status;
                        var config = rejection.config;
                        var method = config.method;
                        var url = config.url;

                        if (status == 401) {
                            $location.path("/login");
                        } else {
                            $rootScope.error = method + " on " + url + " failed with status " + status;
                        }

                        return $q.reject(rejection);
                    }
                };
            });

            $stateProvider
	            .state('login', {
                    templateUrl: 'login/login.html',
                    controller: 'LoginCtrl',
                    url: '/login',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'warehouseApp',
                                files: [
                                    'app/login/login.js'
                                ]
                            })
                        }
                    }
	            })
                .state('home', {
                    templateUrl: 'home/home.html',
                    controller: 'HomeCtrl',
                    url: '/home',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'warehouseApp',
                                files: [
                                    'app/home/HomeCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('order-group-list', {
                    templateUrl: 'order-group-list/order-group-list.html',
                    controller: 'OrderGroupListCtrl',
                    url: '/order-group-list',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'warehouseApp',
                                files: [
                                    'app/order-group-list/OrderGroupListCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('order-group-detail', {
                    templateUrl: 'order-group-detail/order-group-detail.html',
                    controller: 'OrderGroupDetailCtrl',
                    url: '/order-group-detail/?orderGroupId&isPopStashSkus',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'warehouseApp',
                                files: [
                                    'app/order-group-list/OrderGroupSkuService.js',
                                    'app/order-group-detail/OrderGroupDetailCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('check-result', {
                    templateUrl: 'check-result/check-result.html',
                    controller: 'CheckResultCtrl',
                    url: '/check-result/?orderGroupId&result',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'warehouseApp',
                                files: [
                                    'app/order-group-list/OrderGroupSkuService.js',
                                    'app/check-result/CheckResultCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('refund-list', {
                    templateUrl: 'refund-list/refund-list.html',
                    controller: 'RefundListCtrl',
                    url: '/refund-list',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'warehouseApp',
                                files: [
                                    'app/refund-list/RefundListCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('refund-result', {
                    templateUrl: 'refund-result/refund-result.html',
                    controller: 'RefundResultCtrl',
                    url: '/refund-result/?resultStatus',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'warehouseApp',
                                files: [
                                    'app/refund-result/RefundResultCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('stock-willshelf-list', {
                    templateUrl: 'stock-willshelf/stock-willshelf-list.html',
                    controller: 'StockWillshelfCtrl',
                    url: '/stock-willshelf-list/?page&pageSize&{cityId:int}&{depotId:int}&skuName',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'warehouseApp',
                                files: [
                                    'app/stock-willshelf/StockWillshelfCtrl.js'
                                ]
                            })
                        }
                    }
                })
        }
    ]);

window.BOOTSTRAP_OK = true;

angular.element(document).ready(function () {
    angular.bootstrap(document, ['warehouseApp']);
});
