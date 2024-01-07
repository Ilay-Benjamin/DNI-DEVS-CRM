function initPage() {
    initTable();
}

function initTable() {
    $.ajax({
        url: 'https://ilay-apis.online/APIs/API-5b/index.php/user/list?limit=1000',
        type: 'GET',
        success: function (output) {
            loadTable(output);
        }
    });
}


function loadTable(users) {
    const tbl = document.getElementById("my_table1");
    const tblBody = document.createElement("tbody");

    tblBody.id = "my_table_body1";

    var rowsNumber = users.length;
    var columnsNumber = 5;

    var userDataFields = ['id', 'username', 'password', 'fullname', 'bio'];
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
    // appends <table> into <body>
    //  <table><thead><tr><th>hey</th><th>bye</th></tr></thead><tbody><tr><td>r</td><td>R</td></tr><tr><td>a</td><td>A</td></tr></tbody></table>
    // sets the border attribute of tbl to '2'
    tbl.setAttribute("border", "2");
}

function reloadTable(users) {
    const tbl = document.getElementById("my_table1");
    const oldTbody = tbl.getElementById("my_table_body1");
    const newTbody = document.createElement('tbody');
    tbl.replaceChild(newTbody, oldTbody);


    loadTable(users);
}


function getUsersList() {
    var limit = prompt("Enter List Limit: ");
    if (!isNaN(limit)) {
        $.ajax({
            url: 'https://ilay-apis.online/APIs/API-5b/index.php/user/list?limit=' + limit,
            type: 'GET',
            success: function (output) {
                reloadTable(output);
            }
        });
    } else {
        alert("Error. You must enter a valid limit to get users list.");
    }
}

function findUser() {
    var id = prompt("Enter Id: ");
    if (!isNaN(id)) {
        $.ajax({
            url: 'https://ilay-apis.online/APIs/API-5b/index.php/user/find?id=' + id,
            type: 'GET',
            success: function (output) {
                reloadTable([output]);
            }
        });
    } else {
        alert("Error. You must enter a valid id to get a specific user.");
    }
}

function addUser() {
    var username = prompt("Enter Username: ");
    var password = prompt("Enter Password: ");
    var fullname = prompt("Enter Fullname: ");
    var bio = prompt("Enter Bio: ");
    if (typeof username === "string" && typeof password === "string" && typeof fullname === "string" && typeof bio === "string") {
        $.ajax({
            url: 'https://ilay-apis.online/APIs/API-5b/index.php/user/append?' +
                'username=' + username + '&password=' + password + '&fullname=' + fullname + '&bio=' + bio,
            type: 'GET',
            success: function (output) {
                reloadTable(output);
            }
        });
    } else {
        alert("Error. You can only use letters (a-z, A-Z) , digits (0-9) , and symbols ('-', '_') .")
    }
}

