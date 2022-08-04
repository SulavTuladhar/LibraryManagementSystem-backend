var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "libraryManagementSystem"
})

connection.connect(function(err, success) {
    if (err) {
        console.log("Database connection failed ", err);
    } else {
        console.log("Database connection sucessfull")
    }
})

module.exports = connection