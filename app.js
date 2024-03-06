
import $ from "./jquery.js";
window.jQuery = jQuery
window.$ = jQuery
import { Dni, dni } from './dni.js';
import { TableController } from './TableController.js';




export function initPage() {
    //alert("Page initialized");
    $(document).ready(function() {
        $("#error_display_div").hide();
        $("#success_display_div").hide();
        document.getElementById('addUserBtn').addEventListener('click', function(event) {
            onActionButtonClick('addUser');
        });
        document.getElementById('updateUserBtn').addEventListener('click', function(event) {
            onActionButtonClick('updateUserById');
        });
        document.getElementById('deleteUserBtn').addEventListener('click', function(event) {
            onActionButtonClick('deleteUserById');
        });
        document.getElementById('getListBtn').addEventListener('click', function(event) {
            onActionButtonClick('getUsersList');
        });
        document.getElementById('findUserBtn').addEventListener('click', function(event) {
            onActionButtonClick('findUserById');
        });
      //  a();
        TableController.INIT_TABLE();
    });
 //   

}


export function onActionButtonClick(action) {
    console.log(action);
    TableController.EXECUTE_ACTION(action);
}


export function a() {
   // alert("Page loadsfdged");
   // alert("Page loaded");
}
