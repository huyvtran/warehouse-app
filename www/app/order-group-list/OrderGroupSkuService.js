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