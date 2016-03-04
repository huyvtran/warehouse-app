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
        'oc.lazyLoad',
        'angular-loading-bar',
        'ui.router',
        'ui.bootstrap',
        'ngTouch'
    ])
    .constant('apiConfig', {
        "host": "http://warehouse.canguanwuyou.cn"
        // "host": "http://139.129.15.29"  //线上
        // "host": "http://115.28.64.174"  //测试
        // "host": ""  //本地
    })
    .run(function () {
        var fs = new CordovaPromiseFS({
            Promise: Promise
        });

        var loader = new CordovaAppLoader({
            fs: fs,
            serverRoot: 'http://warehouse.canguanwuyou.cn/warehouse/',
            localRoot: 'app',
            cacheBuster: true, 
            checkTimeout: 10000,
            mode: 'mirror',
            manifest: 'manifest.json' + "?" + Date.now()
        });

        function check(){
            loader.check()
                .then(function(){
                    console.log("-----into check ---------");
                    return loader.download();
                })
                .then(function(){
                    console.log("--------into download ---------");
                    return loader.update();
                },function(err){
                    console.error('Auto-update error:',err);
                });
        }

        check();
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

angular.module('warehouseApp')
	.factory('ConfirmModalDialogService', function () {

		var service = {};

		service.AsyncConfirmYesNo = function (msg, yesFn) {
			var $confirm = $("#modalConfirmYesNo");
		    
		    $confirm.modal({backdrop: 'static', keyboard: false});
		    $confirm.modal('show');
		    
		    $("#lblMsgConfirmYesNo").html(msg);

		    $("#btnNoConfirmYesNo").off('click').click(function () {
		        $confirm.modal("hide");

		        $("#barcode-input").focus();
		        $("#check-barcode-input").focus();
		    });

		    $("#btnYesConfirmYesNo").off('click').click(function () {
		        $confirm.modal("hide");

		        $("#barcode-input").focus();
		        $("#check-barcode-input").focus();

		        yesFn();
		    });
		}

		service.AsyncAlert = function (msg) {
			var $alert = $("#alertModal");
		    
		    $alert.modal({backdrop: 'static', keyboard: false});
		    $alert.modal('show');
		    
		    $("#alertMsg").html(msg);

		    $("#alertBtn").off('click').click(function () {
		        $alert.modal("hide");

		        $("#barcode-input").focus();
		        $("#check-barcode-input").focus();
		    });
		}

		return service;
	});
'use strict';
/**
 * @ngdoc function
 * @name warehouseApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the warehouseApp
 */
angular.module('warehouseApp')
    .controller('LoginCtrl', function($scope, $http, $state, apiConfig, ConfirmModalDialogService) {

        $scope.isLoginState = false;

    	$scope.user = {
            username: '',
            password: ''
        };

        // 登录
        $scope.login = function (user) {
            if (user.username === "") {
                ConfirmModalDialogService.AsyncAlert("用户名不能为空");
                return;
            } 
            if (user.password === "") {
                ConfirmModalDialogService.AsyncAlert("密码不能为空");
                return;
            }

            $scope.isLoginState = true;

            $http({
                url: apiConfig.host + "/api/login",
                method: 'POST',
                data: user
            })
            .success(function (data, status) {
                window.localStorage['cachedUsername'] = user.username;
                window.localStorage['password'] = user.password;

                $state.go("home");

                $scope.isLoginState = false;
            })
            .error(function (data, status) {
                $scope.isLoginState = false;

                if (data)
                    ConfirmModalDialogService.AsyncAlert(data.errmsg);
                else
                    ConfirmModalDialogService.AsyncAlert("登录失败");
            });
        };

        if (window.localStorage['cachedUsername']) {
            $scope.user.username = window.localStorage['cachedUsername'];
            $scope.user.password = window.localStorage['password'];

            $scope.login($scope.user);
        }

        // 重置
        $scope.reset = function () {
            $scope.user.username = "";
            $scope.user.password = "";
        };

    });

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

angular.module('warehouseApp')
	.factory('OrderGroupSkuService', function () {

		var service = {};

		service.checkFalureSkus = [];

		service.stashCheckedGroupSkusJsonObj = [];

		service.setCheckFalureSkus = function (checkFalureSkus) {
			service.checkFalureSkus = checkFalureSkus;
		};
	
		service.getCheckFalureSkus = function () {
			return service.checkFalureSkus;
		};

		service.setStashCheckedGroupSkus = function (orderGroupId, trackerName, members, stashCheckedGroupSkus) {
         	if (service.stashCheckedGroupSkusJsonObj.length > 0) {
         		var stamp = true;

         		for (var i=0; i < service.stashCheckedGroupSkusJsonObj.length; i++) {
         			var serviceOrderGroups = service.stashCheckedGroupSkusJsonObj[i];

         			if (serviceOrderGroups.orderGroupId == orderGroupId) {
         				serviceOrderGroups.stashCheckedGroupSkus = stashCheckedGroupSkus;

         				stamp = false;
         			}
         		}

         		if (stamp) {
         			service.stashCheckedGroupSkusJsonObj.push({
	         			orderGroupId: orderGroupId,
	         			trackerName: trackerName,
	         			members: members,
	         			stashCheckedGroupSkus: stashCheckedGroupSkus
	         		});
         		}
         	} else {
         		service.stashCheckedGroupSkusJsonObj.push({
         			orderGroupId: orderGroupId,
         			trackerName: trackerName,
         			members: members,
         			stashCheckedGroupSkus: stashCheckedGroupSkus
         		});
         	}
		};
	
		service.getStashCheckedGroupSkus = function (orderGroupId) {
			if (service.stashCheckedGroupSkusJsonObj.length > 0) {
				var stamp = true;

				for (var i=0; i < service.stashCheckedGroupSkusJsonObj.length; i++) {
         			var serviceOrderGroups = service.stashCheckedGroupSkusJsonObj[i];

         			if (serviceOrderGroups.orderGroupId == orderGroupId) {
         				stamp = false;

         				return service.stashCheckedGroupSkusJsonObj[i];
         			}
         		}

         		if (stamp) {
         			return [];
         		}
			} else {
				return service.stashCheckedGroupSkusJsonObj;
			}
		};

		return service;
	});
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

        $scope.resetPageAndSearch = function () {
            $scope.stockSearchForm.page = 0;
            $scope.stockSearchForm.pageSize = 30;

            $location.search($scope.stockSearchForm);
        };

        $scope.pageChanged = function() {
            $scope.stockSearchForm.page = $scope.page.currentPage - 1;
            $scope.stockSearchForm.pageSize = $scope.page.itemsPerPage;

            $location.search($scope.stockSearchForm);
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
angular.module('warehouseApp')
    .factory('UpdateService', ['$log', '$q', 'apiConfig', function ($log, $q, apiConfig) {
        var fs = new CordovaPromiseFS({
            Promise: Promise
        });

        var loader = new CordovaAppLoader({
            fs: fs,
            serverRoot: 'http://warehouse.canguanwuyou.cn/warehouse/',
            localRoot: 'app',
            cacheBuster: true, // make sure we're not downloading cached files.
            checkTimeout: 10000, // timeout for the "check" function - when you loose internet connection
            mode: 'mirror',
            manifest: 'manifest.json' + "?" + Date.now()
        });
        var service = {
            // Check for new updates on js and css files
            check: function () {
                var defer = $q.defer();

                if(apiConfig.environment == "develop") {
                    defer.resolve(false);
                } else {
                    loader.check().then(function (updateAvailable) {
                        console.log("Update available:");
                        
                        if (updateAvailable) {
                            defer.resolve(updateAvailable);
                        }
                        else {
                            defer.reject(updateAvailable);
                        }
                    });
                }

                return defer.promise;
            },
            // Download new js/css files
            download: function (onprogress) {
                var defer = $q.defer();

                loader.download(onprogress).then(function (manifest) {
                    console.log("Download active!");
                    defer.resolve(manifest);
                }, function (error) {
                    console.log("Download Error:");
                    defer.reject(error);
                });
                return defer.promise;
            },
            // Update the local files with a new version just downloaded
            update: function (reload) {
                console.log("update files--------------");
                return loader.update(reload);
            },
            // Check wether the HTML file is cached
            isFileCached: function (file) {
                if (angular.isDefined(loader.cache)) {
                    return loader.cache.isCached(file);
                }
                return false;
            },
            // returns the cached HTML file as a url for HTTP interceptor
            getCachedUrl: function (url) {
                if (angular.isDefined(loader.cache)) {
                    return loader.cache.get(url);
                }
                return url;
            }
        };

        return service;

    }])

angular.module('warehouseApp')
    .factory('VersionService', function ($http, $q, apiConfig) {
        var service = {};

        service.checkApp = function(versionCode) {

            if(versionCode) {
                return $http({
                    url: apiConfig.host + "/api/v2/version/update",
                    method: 'GET',
                    params: {versionCode: versionCode}
                }).then(function (payload) {
                    if (payload.data) {
                        if (payload.data.versionCode > versionCode) {
                            return payload.data;
                        }
                    }

                    return null;
                })
            } else {
                var deferred = $q.defer();
                deferred.resolve(null);
                return deferred.promise;
            }
        }
        return service;
    })
