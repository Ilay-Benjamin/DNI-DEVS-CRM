function initPage() {
    var table = document.getElementById('my_table');
    $.ajax({
        url: 'https://ilay-apis.online/APIs/API-5/index.php/user/list?limit=1000',
        type: 'GET',
        success: function (output) {
            //alert(JSON.stringify(output));
            loadTable(output);
        }
    });
}


function loadTable(users) {
    var myTable = document
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

        myTable.appendChild(userRow);

    });

}