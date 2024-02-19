require("dotenv").config({path: "../.env"});
const mysql = require("mysql2/promise");
const express = require("express");
const app = express();

console.log(process.env.HOST)

async function server() {
    const connection = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.DATABASE,
        password: process.env.PASSWORD
    });

    app.get("/api", async (req, res) => {
        try {
            const [results] = await connection.query(
                'select * from '+process.env.TABLE
            );
            res.send(results);
        } catch (err) {
            console.log(err);
        }
    });
    
    app.listen(process.env.PORT, () => {
        console.log("Server listening on port "+process.env.PORT);
    });
}

server();