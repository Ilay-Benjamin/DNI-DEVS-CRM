import $ from "./jquery.js";
window.jQuery = jQuery
window.$ = jQuery
import { Action, Actions, ActionFactory } from './actions.js';


export class TableController {

    static INIT_TABLE() {
        var action = ActionFactory.GET(Actions.USERS_LIST_ACTION);
        action.call(this.LOAD_TABLE);
    }
    
    static LOAD_TABLE(output) {
        alert("Loading table");

        const users = output.data;
        const messages = output.messages;
        const status = output.status;

        if (!status) {
            $("#error_display_div").show();
            messages.map((message) => {
                var text = $("#error_display_p").text();
                var buffer = (text.length != 0) ? "\n" : "";
                var text = text + buffer + message;
                $("#error_display_p").text( text );
            });
        }
        
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
                alert(JSON.stringify(user));
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
        this.LOAD_TABLE(output);
    }



    static EXECUTE_ACTION(action) {
        var callback = (output) => {
            this.RELOAD_TABLE(output);
        }
        action.call(callback);
    }
    
} 




