
import $ from "./jquery.js";
window.jQuery = jQuery
window.$ = jQuery
import { TableController } from './TableController.js';
import { Action, Actions, ActionFactory } from './actions.js';



export function initPage() {
    //alert("Page initialized");
    $(document).ready(function() {
        document.getElementById('addUserBtn').addEventListener('click', function(event) {
            onActionButtonClick('addUser');
        });
        document.getElementById('updateUserBtn').addEventListener('click', function(event) {
            onActionButtonClick('updateUser');
        });
        document.getElementById('deleteUserBtn').addEventListener('click', function(event) {
            onActionButtonClick('deleteUser');
        });
        document.getElementById('getListBtn').addEventListener('click', function(event) {
            onActionButtonClick('usersList');
        });
        document.getElementById('findUserBtn').addEventListener('click', function(event) {
            onActionButtonClick('findUser');
        });
      //  a();
        TableController.INIT_TABLE();
    });
 //   

}


export function onActionButtonClick(action) {
    console.log(action);
    alert("Button clicked");
    var action = ActionFactory.GET(action);
    TableController.EXECUTE_ACTION(action);
}


export function a() {
    alert("Page loadsfdged");
   // alert("Page loaded");
}
