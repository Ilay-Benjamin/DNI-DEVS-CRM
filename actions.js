import $ from "./jquery.js";
window.jQuery = jQuery
window.$ = jQuery
import { Output, ErrorTypes, OutputFactory } from './outputs.js';

class Action {

    constructor(name, method, test) {
        this.name = name;
        this.method = method;
        this.test = test;
    }

    call(callback) {
        var inputs = this.#requireInput();
        console.log('inputs: ' + JSON.stringify(inputs));

        var response = new Output();
        console.log('old response: ' + JSON.stringify(response));

        var testResults = this.test(inputs);
        console.log('testResults: ' + JSON.stringify(testResults));

        response.mergeStatus(testResults);
        response.mergeMessages(testResults);
        response.data = [];
        console.log('new response: ' + JSON.stringify(response));

        if (response.status) { 
            inputs.callback = callback;
            inputs.output = response;
            this.method({ ...inputs});
        }
    }

    #requireInput() {
        var inputsNames = this.method.toString()
        .match(/\(([^)]+)\)/)[1]  // Extract the parameters string inside the parentheses
        .replace(/[{}]/g, '')     // Remove curly braces
        .split(',')               // Split the string into an array by commas
        .map(name => name.trim()) // Trim whitespace from each parameter name
        .filter(name => name !== 'callback' && name !== '' && name !== 'output'); // Remove 'callback' and empty strings    
        var translatedInputsNames = {
            id: "מס' מזהה",
            fullname: "שם מלא",
            phoneNumber: "מספר טלפון",
            email: "כתובת אימייל",
            limit: "מספר מקסימלי של משתמשים",
        };
        console.log('inputsNames: ' + inputsNames);
        console.log('translatedInputsNames: ' + JSON.stringify(translatedInputsNames));
        var inputs = {};
        inputsNames.forEach(name => inputs[name] = prompt("אנא הכנס " + translatedInputsNames[name] + ": "));
        return inputs;
    }

}


class Actions {
    static USERS_LIST_ACTION = 'usersList';
    static FIND_USER_ACTION = 'findUser';
    static ADD_USER_ACTION = 'addUser';
    static DELETE_USER_ACTION = "deleteUser";
    static UPDATE_USER_ACTION = "updateUser";
    constructor(){}
}


class ActionFactory {
    static GET(action) {
        switch (action) {
            case Actions.USERS_LIST_ACTION:
                return new UsersListAction();
            case Actions.FIND_USER_ACTION:
                return new FindUserAction();
            case Actions.ADD_USER_ACTION:
                return new AddUserAction();
            case Actions.DELETE_USER_ACTION:
                return new DeleteUserAction();
            case Actions.UPDATE_USER_ACTION:
                return new UpdateUserAction();
            default:
                return null;
        }
    }
}


class UsersListAction extends Action {

    static name() { return "usersList"; }

    static test({limit}) {
        if (limit == null || limit.toString().length == 0) {
            return OutputFactory.GET_INVALID_INPUT_OUTPUT('limit', ErrorTypes.EMPTY_INPUT);
        }
        if (isNaN(limit)) {
            return OutputFactory.GET_INVALID_INPUT_OUTPUT('limit', ErrorTypes.INVALID_INPUT);
        }
        if (limit < 0) {
            return OutputFactory.GET_INVALID_INPUT_OUTPUT('limit', ErrorTypes.INVALID_INPUT);
        }
        if (limit.toString().length > 9999) {
            return OutputFactory.GET_INVALID_INPUT_OUTPUT('limit', ErrorTypes.LONG_INPUT_LENGTH);
        }
        return OutputFactory.GET_SUCCESS_OUTPUT();
    }

    static method({limit, callback, output}) {
        $.ajax({
            url: 'https://ilay-apis.online/APIs/API-7/index.php/user/list?limit=' + limit,
            type: 'GET',
            success: function (data) {
                if (data.length == 0) {
                    callback(OutputFactory.GET_SYSTEM_ERROR_OUTPUT(ErrorTypes.USER_NOT_FOUND));
                } else {
                    console.log('data: ' + JSON.stringify(data));
                    console.log('output before addData(): ' + JSON.stringify(output));
                    output.addData(data);
                    callback(output);
                }
            }
        });
    }

    constructor() {
        super('', () => {});
        this.name = this.constructor.name;
        this.method = this.constructor.method;
        this.test = this.constructor.test;
    }

}


class FindUserAction extends Action {

    static name() { return "findUser"; }

    static test({id}) {
        var output = new Output();
        if (id == null || id.toString().length == 0) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מס' מזהה", ErrorTypes.EMPTY_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (isNaN(id)) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מס' מזהה", ErrorTypes.INVALID_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (id < 0) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מס' מזהה", ErrorTypes.INVALID_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (id.toString().length > 9999) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מס' מזהה", ErrorTypes.LONG_INPUT_LENGTH);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        }
        var newOutput = OutputFactory.GET_SUCCESS_OUTPUT([]);
        output.mergeStatus(newOutput);
        output.mergeMessages(newOutput);
        return output;
    }

    static method({id, callback, output}) {
        $.ajax({url: 'https://ilay-apis.online/APIs/API-7/index.php/user/find?id=' + id,
            type: 'GET', 
            success: function (data) {
                console.log('data: ' + JSON.stringify(data));
                output.addData([data]);
                callback(output);
            }
        });
    }

    constructor() {
        super('', () => {}); // Dummy values for initialization
        // Override the parent class properties with private values
        this.name = this.constructor.name;
        this.method = this.constructor.method;
        this.test = this.constructor.test;
    }

}


class AddUserAction extends Action {

    static name() { return "addUser"; }

    static test({fullname, phoneNumber, email}) {
        var output = new Output();
        if (fullname == null || fullname.toString().length == 0) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT('שם מלא', ErrorTypes.EMPTY_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (!/[^\s]/.test(fullname)) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT('שם מלא', ErrorTypes.INVALID_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        }
        if (phoneNumber == null || phoneNumber.toString().length == 0) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מספר טלפון", ErrorTypes.EMPTY_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (!/^[0-9-]+$/.test(phoneNumber)) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מספר טלפון", ErrorTypes.INVALID_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if ((phoneNumber.match(/-/g) || []).length) {
            var dashCount = (phoneNumber.match(/-/g) || []).length;
            if (dashCount > 1) {
                var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מספר טלפון", ErrorTypes.INVALID_INPUT);
                output.status = newOutput.status && output.status;
                output.messages.conact(newOutput.messages);
            }
            if (dashCount == 1 && phoneNumber[3] != '-') {
                var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מספר טלפון", ErrorTypes.INVALID_INPUT);
                output.status = newOutput.status && output.status;
                output.messages.conact(newOutput.messages);
            }
            phoneNumber = phoneNumber.replace(/-/g, '');
        } else if (phoneNumber.toString().length < 10) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מספר טלפון", ErrorTypes.SHORT_INPUT_LENGTH);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (phoneNumber.toString().length > 10) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מספר טלפון", ErrorTypes.LONG_INPUT_LENGTH);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        }
        if (email == null || email.toString().length == 0) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("כתובת אימייל", ErrorTypes.EMPTY_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (!/^[a-zA-Z]+[a-zA-Z0-9]*@[a-zA-Z0-9]+\.[a-zA-Z]+(?:\.[a-zA-Z]+)*$/.test(email) || !(email.match(/@/g) || []).length === 1) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("כתובת אימייל", ErrorTypes.INVALID_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (email.length > 255) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("כתובת אימייל", ErrorTypes.LONG_INPUT_LENGTH);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        }
        var newOutput = OutputFactory.GET_SUCCESS_OUTPUT([]);
        output.mergeStatus(newOutput);
        output.mergeMessages(newOutput);
        return output;
    }

    static method({fullname, phoneNumber, email, callback, output}) {
        $.ajax({
            url: 'https://ilay-apis.online/APIs/API-7/index.php/user/append?' +
                'fullname=' + fullname + '&phoneNumber=' + phoneNumber + '&email=' + email,
            type: 'GET',
            success: function (data) {
                output.addData(data);
                callback(output);
            }
        });
    }

    constructor() {
        super('', () => {}); // Dummy values for initialization
        // Override the parent class properties with private values
        this.name = this.constructor.name;
        this.method = this.constructor.method;
        this.test = this.constructor.test;
    }

}


class DeleteUserAction extends Action {

    static name() { return "deleteUser"; }

    static test({id}) {
        var output = new Output();
        if (id == null || id.toString().length == 0) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מס' מזהה", ErrorTypes.EMPTY_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (isNaN(id)) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מס' מזהה", ErrorTypes.INVALID_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (id < 0) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מס' מזהה", ErrorTypes.INVALID_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (id.toString().length > 9999) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מס' מזהה", ErrorTypes.LONG_INPUT_LENGTH);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        }
        var newOutput = OutputFactory.GET_SUCCESS_OUTPUT([]);
        output.mergeStatus(newOutput);
        output.mergeMessages(newOutput);
        return output;
    }

    static method({id, callback, output}) {
        $.ajax({url: 'https://ilay-apis.online/APIs/API-7/index.php/user/find?id=' + id,
            type: 'GET', 
            success: function (data) {
                $.ajax({
                    url: 'https://ilay-apis.online/APIs/API-7/index.php/user/delete?id=' + id,
                    type: 'GET',
                    success: function (data) {
                        output.addData(data);
                        callback(output);
                    }
                });
            }, error: function (data) {
                callback(OutputFactory.GET_SYSTEM_ERROR_OUTPUT(ErrorTypes.USER_NOT_FOUND))
        }});
    }

    constructor() {
        super('', () => {}); // Dummy values for initialization
        // Override the parent class properties with private values
        this.name = this.constructor.name;
        this.method = this.constructor.method;
        this.test = this.constructor.test;
    }

}


class UpdateUserAction extends Action {

    static name() { return "updateUser"; }

    static test({id, fullname, phoneNumber, email}) {
        var output = new Output();
        if (id == null || id.toString().length == 0) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מס' מזהה", ErrorTypes.EMPTY_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (isNaN(id)) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מס' מזהה", ErrorTypes.INVALID_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (id < 0) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מס' מזהה", ErrorTypes.INVALID_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (id.toString().length > 9999) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מס' מזהה", ErrorTypes.LONG_INPUT_LENGTH);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        }
        if (fullname == null || fullname.toString().length == 0) {
            //Pass
        } else if (!/[^\s]/.test(fullname)) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT('שם מלא', ErrorTypes.INVALID_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        }
        if (phoneNumber == null || phoneNumber.toString().length == 0) {
            //Pass
        } else if (!/^[0-9-]+$/.test(phoneNumber)) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מספר טלפון", ErrorTypes.INVALID_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if ((phoneNumber.match(/-/g) || []).length) {
            var dashCount = (phoneNumber.match(/-/g) || []).length;
            if (dashCount > 1) {
                var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מספר טלפון", ErrorTypes.INVALID_INPUT);
                output.status = newOutput.status && output.status;
                output.messages.conact(newOutput.messages);
            }
            if (dashCount == 1 && phoneNumber[3] != '-') {
                var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מספר טלפון", ErrorTypes.INVALID_INPUT);
                output.status = newOutput.status && output.status;
                output.messages.conact(newOutput.messages);
            }
            phoneNumber = phoneNumber.replace(/-/g, '');
        } else if (phoneNumber.toString().length < 10) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מספר טלפון", ErrorTypes.SHORT_INPUT_LENGTH);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (phoneNumber.toString().length > 10) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("מספר טלפון", ErrorTypes.LONG_INPUT_LENGTH);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        }
        if (email == null || email.toString().length == 0) {
            //Pass
        } else if (!/^[a-zA-Z]+[a-zA-Z0-9]*@[a-zA-Z0-9]+\.[a-zA-Z]+(?:\.[a-zA-Z]+)*$/.test(email) || !(email.match(/@/g) || []).length === 1) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("כתובת אימייל", ErrorTypes.INVALID_INPUT);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        } else if (email.length > 255) {
            var newOutput = OutputFactory.GET_INVALID_INPUT_OUTPUT("כתובת אימייל", ErrorTypes.LONG_INPUT_LENGTH);
            output.mergeStatus(newOutput);
            output.mergeMessages(newOutput);
        }
        var newOutput = OutputFactory.GET_SUCCESS_OUTPUT([]);
        console.log('newOutput: ' + JSON.stringify(newOutput));
        output.mergeStatus(newOutput);
        output.mergeMessages(newOutput);
        return output;
    }

    static method({id, fullname, phoneNumber, email, callback, output}) {
        id = id;
        var path = 'https://ilay-apis.online/APIs/API-7/index.php';
        var query = '/user/update?id=' + id;
        if (fullname != null && fullname.toString().length != 0) {
            query = query + '&fullname=' + fullname;
        } else {
            fullname = "";
        }
        if (phoneNumber != null && phoneNumber.toString().length != 0) {
            query = query + '&phoneNumber=' + phoneNumber;
        } else {
            phoneNumber = "";
        }
        if (email != null && email.toString().length != 0) {
            query = query + '&email=' + email;
        } else {
            email = "";
        }
        var url = path + query;
        console.log('url: ' + url);
        $.ajax({
            url: 'https://ilay-apis.online/APIs/API-7/index.php/user/find?id=' + id,
            type: 'GET', 
            success: function (data) {
                console.log('data: ' + JSON.stringify(data));
                $.ajax({
                    //https://ilay-apis.online/APIs/API-7/index.php/user/update?id=5&fullname=Netaa&phoneNumber=0542341111
                    url: url,
                    type: 'GET',
                    success: function (data) {
                        output.addData(data);
                        callback(output);
                    }
                });
            }, error: function (data) {
                callback(OutputFactory.GET_INTERNAL_SERVER_ERROR_OUTPUT(ErrorTypes.USER_NOT_FOUND))
            }});
    }

    constructor() {
        super('', () => {}); // Dummy values for initialization
        // Override the parent class properties with private values
        this.name = this.constructor.name;
        this.method = this.constructor.method;
        this.test = this.constructor.test;
    }

}


export { ActionFactory, Action, Actions};

/*

class  f{


    static callAction(action) {
        
    }


    
    _findUser() {
        var id = prompt("Enter Id: ");
        if (!isNaN(id)) {
            $.ajax({
                url: 'https://ilay-apis.online/APIs/API-7/index.php/user/find?id=' + id,
                type: 'GET',
                success: function (data) {
                    reloadTable([data]);
                }
            });
        } else {
            alert("Error. You must enter a valid id to get a specific user.");
        }
    }
    
    _addUser() {
        var fullname = prompt("Enter fullname: ");
        var phoneNumber = prompt("Enter phoneNumber: ");
        var email = prompt("Enter email: ");
        if (typeof fullname === "string" && typeof phoneNumber === "string" && typeof email === "string") {
            $.ajax({
                url: 'https://ilay-apis.online/APIs/API-7/index.php/user/append?' +
                    'fullname=' + fullname + '&phoneNumber=' + phoneNumber + '&email=' + email,
                type: 'GET',
                success: function (data) {
                    reloadTable(data);
                }
            });
        } else {
            alert("Error. You can only use letters (a-z, A-Z) , digits (0-9) , and symbols ('-', '_') .")
        }
    }
    
    
    _deleteUser() {
        var id = prompt("Enter Id: ");
        if (!isNaN(id)) {
            $.ajax({
                url: 'https://ilay-apis.online/APIs/API-7/index.php/user/delete?id=' + id,
                type: 'GET',
                success: function (data) {
                    reloadTable(data);
                }
            });
        } else {
            alert("Error. You must enter a valid id to delete a specific user.");
        }
    }
}
    
    
    function updateUser() {
        var id = prompt("Enter Id: ");
        if (!isNaN(id)) {
            var fullname = prompt("Enter fullname (Leave Empty For Not Changing): ");
            var phoneNumber = prompt("Enter phoneNumber(Leave Empty For Not Changing): ");
            var email = prompt("Enter email(Leave Empty For Not Changing): ");
            if (typeof fullname === "string" || typeof phoneNumber === "string" || typeof email === "string") {
                $.ajax({
                    url: 'https://ilay-apis.online/APIs/API-7/index.php/user/update?id=' + id +
                        (fullname != "" ? ('&fullname=' + fullname) :
                            (phoneNumber != "" ? ('&phoneNumber=' + phoneNumber) :
                                (email != "" ? ('&email=' + email) : ("")))),
                    type: 'GET',
                    success: function (data) {
                        reloadTable(data);
                    }
                });
            } else {
                alert("Error. You must enter a valid id to delete a specific user.");
            }
        }
}

*/