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
    .run(function () {
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

//window.BOOTSTRAP_OK = true;
//
//angular.element(document).ready(function () {
//    angular.bootstrap(document, ['warehouseApp']);
//});
