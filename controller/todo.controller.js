sap.ui.define([
	"jquery.sap.global",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
], function(jQuery, MessageToast, Fragment, DateFormat, Controller, JSONModel) {
	"use strict";

  return Controller.extend("todo.controller.todo", {
		onInit: function() {
			var that = this;
			$.ajax({
				dataType:'json',
				url:'/Model',
				success: function (data) {
						var oModel = new JSONModel(data);									//obj with JSON data
						oModel.setDefaultBindingMode('TwoWay');
						that.getView().setModel(oModel);
				}
			});

			Fragment.load({
				//id: this.getView().getId(),
				name: "todo.view.changeTaskDialog",
				controller: this
			}).then(function(oDialog){
				that.getView().addDependent(oDialog);
				that.oEditDialog = oDialog;
			});
		},

		formatDate: function (value) {
			return new Date(value).toUTCString();
		},

		onPost: function(event) {
			var oDate = new Date();
			var sDate = oDate.toISOString();
			var oModel = this.getView().getModel();
			var aEntries = oModel.getData().EntryCollection;
			// create new entry
			var sValue = event.getParameter("value");
			var oEntry = {
				DateCreation: "" + sDate,
				task: sValue,
				status: "in progress",
			};

			// update Database
			$.ajax({
				type: "POST",
				data: oEntry,
				url: '/Model/newPost',
				success: function (id) {
					oEntry.id=id;
				}
			});

			// update model
			aEntries.push(oEntry);
			oModel.setData({
				EntryCollection: aEntries
			});
		},

		onDone: function(event) {
			var	oControl = event.getSource();
			var item = oControl.getBindingContext().getObject();
			var oModel = oControl.getModel();
			if(item.status=='done'){
				oModel.setProperty(oControl.getBindingContext().getPath()+'/status', 'in progress');
			}else{
				oModel.setProperty(oControl.getBindingContext().getPath()+'/status', 'done');
			}

			//set status on database
			$.ajax({
				type: 'POST',
				url: '/Model/changeStatus',
				data: item
			});
		},

		onFailed: function(event) {
			var	oControl = event.getSource();
			var item = oControl.getBindingContext().getObject();
			var oModel = oControl.getModel();
			if(item.status=='failed'){
				oModel.setProperty(oControl.getBindingContext().getPath()+'/status', 'in progress');
			}else{
				oModel.setProperty(oControl.getBindingContext().getPath()+'/status', 'failed');
			}

			//set status on database
			$.ajax({
				type: 'POST',
				url: '/Model/changeStatus',
				data: item
			});
		},

		formatStatus: function(value){
			if(value =='done'){
				return 'Low'
			} else if (value =='failed') {
				return 'High'
			} else{
				return 'None'
			}
		},

		onCloseDialog: function(event){
			var item = event.getSource().getBindingContext().getObject();
			$.ajax({
				type: 'POST',
				url: '/Model/changeTask',
				data: item
			});
			this.oEditDialog.close();
		},

		onListItemPress: function(event) {
			//----------------------------------------------
			//-----------------OpenDialog-------------------
			//----------------------------------------------
				var oControl = event.getSource();

				if (this.oEditDialog) {
					this.oEditDialog.bindElement({path: oControl.getBindingContext().getPath() });
					this.oEditDialog.open();
				}
		},

		onItemClose: function(event){
			// update model
			var oModel = this.getView().getModel();
			var aEntries = oModel.getData().EntryCollection;

			var item = event.getSource()

				//get selected item
				var itemData = item.getBindingContext().getObject();
				//delete selected item from Model
				aEntries = aEntries.filter(item => item.id !== itemData.id);
				//delete selected item from database
				$.ajax({
					type: 'POST',
					url: '/Model/deletePost',
					data: itemData
				});

				oModel.setData({
					EntryCollection: aEntries
				});

		}
	});
});
