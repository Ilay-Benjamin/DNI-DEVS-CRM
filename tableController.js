import $ from "./jquery.js";
window.jQuery = jQuery
window.$ = jQuery
import { Action, Actions, ActionFactory } from './actions.js';



export class TableController {

    static INIT_TABLE() {
        var action = ActionFactory.GET(Actions.ALL_USERS_ACTION);
        var callback = {
            success: function (output) {
                TableController.LOAD_TABLE(output);
            },
            error: function (output) {
                TableController.SHOW_ERROR_MESSAGE(output);
            }
        }
        action.call(callback);
        $("#error_display_div").hide();
    }
    
    static LOAD_TABLE(output) {
        //alert("Loading table");

        const users = output.data;
        const messages = output.messages;
        const status = output.status;
        
        const tbl = document.getElementById("my_table1");
        const tblBody = document.createElement("tbody");
    
        tblBody.id = "my_table_body1";
    
        var rowsNumber = users.length;
        var columnsNumber = 4;
    
        var userDataFields = ['id', 'fullname', 'email', 'phoneNumber'];
        var userDataFieldsOrder = ['id', 'fullname', 'email', 'phoneNumber'];
        for (let row = 0; row < rowsNumber; row++) {
            const user = users[row];
            const dataRow = document.createElement("tr");
    
            dataRow.addEventListener("click", () => {
                
                //alert(JSON.stringify(user));
            });
    
            for (let column = 0; column < columnsNumber; column++) {
                const userDataField = user[userDataFields[column]];
                const dataCell = document.createElement("td");
                const cellText = document.createTextNode(userDataField);
    
                dataCell.className = userDataFields[column] + "-cell";
    
                dataCell.appendChild(cellText);
                dataRow.appendChild(dataCell);
            }
    
            tblBody.appendChild(dataRow);
        }
    
        tbl.appendChild(tblBody);
        tbl.setAttribute("border", "2");
    }

    static RELOAD_TABLE(output) {
        const tbl = document.getElementById("my_table1");
        const oldTbody = document.getElementById("my_table_body1");
        const newTbody = document.createElement('tbody');
        tbl.replaceChild(newTbody, oldTbody);
        $("#error_display_p").text('');
        $("#error_display_div").hide();
        this.LOAD_TABLE(output);
    }

    static SHOW_ERROR_MESSAGE(output) {
        const messages = output.messages;
        $("#error_display_div").show();
        var text = "";
        messages.forEach((message, index) => {
            if (index > 0) {
                text += "<br>"; // Add a line break before each subsequent message
            }
            text += message; // Append the message
        });
        $("#error_display_p").html(text); // Use .html() to render the line breaks
    }



    static EXECUTE_ACTION(action) {
        var callback = {
            success: function (output) {
                TableController.RELOAD_TABLE(output);
            },
            error: function (output) {
                TableController.SHOW_ERROR_MESSAGE(output);
            }
        }
        
        action.call(callback);
    }
    
} 




