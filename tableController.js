
import $ from "./jquery.js";
window.jQuery = jQuery
window.$ = jQuery
import { Dni, dni } from './dni.js';
import { Actions } from "../crm_library/dni-crm/lib/action.js";



export class TableController {

    static USER_INFO_STATE = {
        id: 0,
        number: -1,
        isLoaded: false,
        dataRow: null
    }

    static INIT_TABLE() {
        dni.getAllUsersList().then((output) => {
            if (output.status) {
                TableController.LOAD_TABLE(output);
            } else {
                TableController.SHOW_ERROR_MESSAGE(output);
            }
        })
      //  $("#error_display_div").hide();
      //  $("#success_display_div").hide();
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
                if (!TableController.USER_INFO_STATE.isLoaded) {
                    TableController.SHOW_USER_INFO(user);
                    TableController.USER_INFO_STATE.id = user.id;
                    TableController.USER_INFO_STATE.number = row;
                    TableController.USER_INFO_STATE.isLoaded = true;
                    TableController.USER_INFO_STATE.dataRow = dataRow;
                    TableController.USER_INFO_STATE.dataRow.style.backgroundColor = "coral";
                } else {
                    if (TableController.USER_INFO_STATE.id == user.id) {
                        TableController.CLOSE_USER_INFO();
                        TableController.USER_INFO_STATE.dataRow.style.backgroundColor = (TableController.USER_INFO_STATE.number % 2 == 0 ? '#f2f2f2' : 'antiquewhite');
                        TableController.USER_INFO_STATE.id = 0;
                        TableController.USER_INFO_STATE.number = -1;
                        TableController.USER_INFO_STATE.isLoaded = false;
                        TableController.USER_INFO_STATE.dataRow = null;
                    } else {
                        TableController.CLOSE_USER_INFO();
                        TableController.USER_INFO_STATE.dataRow.style.backgroundColor = (TableController.USER_INFO_STATE.number % 2 == 0 ? '#f2f2f2' : 'antiquewhite');
                        TableController.USER_INFO_STATE.id = 0;
                        TableController.USER_INFO_STATE.number = -1;
                        TableController.USER_INFO_STATE.isLoaded = false;
                        TableController.USER_INFO_STATE.dataRow = null;
                        TableController.SHOW_USER_INFO(user);
                        TableController.USER_INFO_STATE.id = user.id;
                        TableController.USER_INFO_STATE.number = row;
                        TableController.USER_INFO_STATE.isLoaded = true; ;
                        TableController.USER_INFO_STATE.dataRow = dataRow;
                        TableController.USER_INFO_STATE.dataRow.style.backgroundColor = "coral";
                    }
                }
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
        $("#success_display_p").text('');
        $("#success_display_div").hide();
        this.LOAD_TABLE(output);
    }

    static SHOW_ERROR_MESSAGE(output) {
        console.log('output: ' + JSON.stringify(output));
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

    static SHOW_USER_INFO(user) {
        $("#success_display_div").show();
        var text = "";
        text += "מספר מזהה" + ": " + user.id + "<br>";
        text += "שם מלא" + ": " + user.fullname + "<br>";
        text += "אימייל" + ": " + user.email + "<br>";
        text += "מספר טלפון" + ": " + user.phoneNumber + "<br>";
        $("#success_display_p").html(text);
    }

    static CLOSE_USER_INFO() {
        $("#success_display_div").hide();
        $("#success_display_p").html('');
    }

    static EXECUTE_ACTION(action) {
       var success = function (output) {
        TableController.RELOAD_TABLE(output);
       }
    var error = function (output) {
        TableController.SHOW_ERROR_MESSAGE(output);
    }
        switch (action) {
            case Actions.ADD_USER_ACTION:
                var inputs = TableController.#REQUIRE_INPUTS(['fullname', 'email', 'phoneNumber']);
                dni.addUser(inputs.fullname, inputs.email, inputs.phoneNumber)
                    .then((output) => { success(output); })
                    .catch((output) => { error(output); });
                break;
            case Actions.UPDATE_USER_ACTION:
                var inputs = TableController.#REQUIRE_INPUTS(['id', 'fullname', 'email', 'phoneNumber']);
                dni.updateUserById(parseInt(inputs.id), inputs.fullname, inputs.email, inputs.phoneNumber)
                    .then((output) => { success(output); })
                    .catch((output) => { error(output); });
                break;
            case Actions.DELETE_USER_ACTION:
                var inputs = TableController.#REQUIRE_INPUTS(['id']);
                dni.deleteUserById(parseInt(inputs.id))
                    .then((output) => { success(output); })
                    .catch((output) => { error(output); });
                break;
            case Actions.USERS_LIST_ACTION:
                var inputs = TableController.#REQUIRE_INPUTS(['limit']);
                dni.getUsersList(parseInt(inputs.limit))
                    .then((output) => { success(output); })
                    .catch((output) => { error(output); });
                break;
            case Actions.ALL_USERS_ACTION:
            var inputs = [];
            dni.getAllUsersList()
                .then((output) => { success(output); })
                .catch((output) => { error(output); });
                break;
            case Actions.FIND_USER_BY_ID_ACTION:
                var inputs = TableController.#REQUIRE_INPUTS(['id']);
                dni.findUserById(parseInt(inputs.id))
                    .then((output) => { success(output); })
                    .catch((output) => { error(output); });
                break;
            case Actions.FIND_USER_BY_EMAIL_ACTION:
                var inputs = TableController.#REQUIRE_INPUTS(['email'])
                dni.findUserByEmail(inputs.email)
                    .then((output) => { success(output); })
                    .catch((output) => { error(output); });
                break;
                
        }
    }

    static #REQUIRE_INPUTS(fields) {
        var translatedInputsNames = {
            id: "מס' מזהה",
            fullname: "שם מלא",
            phoneNumber: "מספר טלפון",
            email: "כתובת אימייל",
            limit: "מספר מקסימלי של משתמשים",
        };
        console.log('fields: ' + fields);
        console.log('translatedInputsNames: ' + JSON.stringify(translatedInputsNames));
        var inputs = {};
        fields.forEach(name => inputs[name] = prompt("אנא הכנס " + translatedInputsNames[name] + ": "));
        console.log('inputs: ' + JSON.stringify(inputs));
        return inputs;
    }
    
} 



/*
        var inputs = [];
        fields.forEach((field) => {
            switch(field) {
                case 'id':
                    var id = prompt ("אנא הכנס מס' מזהה: ").toString();
                    inputs.push(parseInt(id));
                    break;
                case 'fullname':
                    var fullname = prompt ("אנא הכנס שם מלא: ").toString();
                    inputs.push(fullname);
                    break;
                case 'email':
                    var email = prompt ('אנא הכנס כתובת אימייל: ').toString();
                    inputs.push(email);
                    break;
                case 'phoneNumber':
                    var phoneNumber = prompt ('אנא הכנס מספר טלפון: ').toString();
                    inputs.push(phoneNumber);
                    break;
                case 'limit': 
                    var limit = prompt ('אנא הכנס מספר מקסימלי של משתמשים: ').toString();
                    inputs.push(parseInt(limit));
                    break;
            }
        });
        return inputs;
*/


