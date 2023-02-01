sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
  ], function (Controller, MessageToast, JSONModel, ResourceModel){
      "use strict";
  
    return Controller.extend("todo.controller.detail",{
  
        onInit: function (){
            	this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
        },
        
		formatDate: function (value) {
			return new Date(value).toUTCString();
		},
  
    });
  });
  