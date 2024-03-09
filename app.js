
import $ from "./jquery.js";
window.jQuery = jQuery
window.$ = jQuery
import { Dni, dni } from './dni.js';
import { TableController } from './TableController.js';
import { Actions } from "../crm_library/dni-crm/lib/action.js";




export function initPage() {
    //alert("Page initialized");
    $(document).ready(function() {
        $("#error_display_div").hide();
        $("#success_display_div").hide();
        document.getElementById('addUserBtn').addEventListener('click', function(event) {
            onActionButtonClick(Actions.ADD_USER_ACTION);
        });``
        document.getElementById('updateUserBtn').addEventListener('click', function(event) {
            onActionButtonClick(Actions.UPDATE_USER_ACTION);
        });
        document.getElementById('deleteUserBtn').addEventListener('click', function(event) {
            onActionButtonClick(Actions.DELETE_USER_ACTION);
        });
        document.getElementById('getListBtn').addEventListener('click', function(event) {
            onActionButtonClick(Actions.USERS_LIST_ACTION);
        });
        document.getElementById('findUserByIdBtn').addEventListener('click', function(event) {
            onActionButtonClick(Actions.FIND_USER_BY_ID_ACTION);
        });
        document.getElementById('findUserByEmailBtn').addEventListener('click', function(event) {
            onActionButtonClick(Actions.FIND_USER_BY_EMAIL_ACTION);
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
