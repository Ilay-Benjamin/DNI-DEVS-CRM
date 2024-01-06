function initPage() {
    initTable();
}

function initTable() {
    $.ajax({
        url: 'https://ilay-apis.online/APIs/API-5/index.php/user/list?limit=1000',
        type: 'GET',
        success: function (output) {
            loadTable(output);
        }
    });
}


function loadTable(users) {
    var tbody  = document
        .getElementById("my_table")
        .getElementsByTagName("tbody")[0];

    users.forEach((user, index) => {
        var userRow = document.createElement("tr");
        userRow.id = user.id;
        userRow.addEventListener("click", () => { alert(JSON.stringify(user)) });

        Object.keys(user).forEach((key) => {
            var dataCell = document.createElement("td");
            dataCell.textContent = user[key];
            userRow.appendChild(dataCell);
        });

        tbody.appendChild(userRow);
    });
}

function reloadTable(users) {
    var tbody  = document
        .getElementById("my_table")
        .getElementsByTagName("tbody")[0];
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    loadTable(users);
}


function getUsersList() {
    var limit = prompt("Enter List Limit: ");
    if (!isNaN(limit)) {
        $.ajax({
            url: 'https://ilay-apis.online/APIs/API-5/index.php/user/list?limit=' + limit,
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
            url: 'https://ilay-apis.online/APIs/API-5/index.php/user/find?id=' + id,
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
    if ( typeof username === "string" && typeof password === "string" && typeof fullname === "string" && typeof bio === "string") {
        $.ajax({
            url: 'https://ilay-apis.online/APIs/API-5/index.php/user/append?' +
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

