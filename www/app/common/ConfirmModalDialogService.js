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

		service.AsyncDialogShow = function(title,msg){
			var dialogModal = $("#dialogModal");
			dialogModal.modal({backdrop: 'static', keyboard: false});
			dialogModal.modal('show');
			$("#downloadProgressMessage").text(msg);
			$("#dialogTitle").text(title);
		}

		service.AsyncDialogHide = function(){
			var dialogModal = $("#dialogModal");
			dialogModal.modal('hide');
			$("body .modal-backdrop").remove();
		}


		return service;
	});