require("dotenv").config({path: "../.env"});
const mysql = require("mysql2/promise");
const express = require("express");
const app = express();
const port = 8000;

console.log(process.env.HOST)

async function server() {
    app.get("/", (req, res) => {
        res.send("");
    });
    
    app.listen(port, () => {
        console.log("Server listening on port "+port);
    });
    
    const connection = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.DATABASE,
        password: process.env.PASSWORD
    });
    
    try {
        const [results] = await connection.query(
            'select * from list'
        );
        console.log(results);
    } catch (err) {
        console.log(err);
    }
}

server();