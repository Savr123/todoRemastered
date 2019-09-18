sap.ui.define([
   "sap/ui/core/UIComponent",
   'sap/m/MessageToast',
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/resource/ResourceModel",
   "sap/ui/Device"
], function (UIComponent, MessageToast, JSONModel, ResourceModel, Device) {
   "use strict";
   return UIComponent.extend("todo.Component", {

     metadata : {
 			manifest: "json"
 		},

      init : function () {
         // call the init function of the parent
         UIComponent.prototype.init.apply(this, arguments);
  			 // create the views based on the url/hash
         this.getRouter().initialize();
      }
   });
});
