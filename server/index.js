require("dotenv").config({path: "../.env"});
const mysql = require("mysql2/promise");
const express = require("express");
const app = express();
app.use(express.json());


async function server() {
    const connection = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.DATABASE,
        password: process.env.PASSWORD
    });

    app.get("/api", async (req, res) => {
        if (req.query.hasOwnProperty("title")) {
            try {
                const [results] = await connection.query(
                    'select * from '+process.env.TABLE+` where name="${req.query.title}" and release_year="${req.query.year}"`
                );
                res.send(results);
            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                const [results] = await connection.query(
                    'select * from '+process.env.TABLE
                );
                res.send(results);
            } catch (err) {
                console.log(err);
            }
        }
    });

    app.post("/api", async (req, res) => {
        if (req.body.rating !== undefined) {
            try {
                await connection.query(
                    `insert into ${process.env.TABLE}(name, release_year, rating, watched) values("${req.body.title}", ${req.body.year}, ${req.body.rating}, ${req.body.watched})`
                )
                console.log("insert done")
                res.send("insert done");
            } catch (err) {
                console.log(err);
            }
        } else if (req.body.field !== undefined) {
            try {
                if (isNaN(req.body.answer)) {
                    await connection.query(
                        `update ${process.env.TABLE} set ${req.body.field} = "${req.body.answer}" where name="${req.body.title}" and release_year=${req.body.year}`
                    );
                } else {
                    await connection.query(
                        `update ${process.env.TABLE} set ${req.body.field} = ${req.body.answer} where name="${req.body.title}" and release_year=${req.body.year}`
                    );
                }
                console.log("removal done")
                res.send("removal done");
            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                await connection.query(
                    `delete from ${process.env.TABLE} where name="${req.body.title}" and release_year=${req.body.year}`
                )
                console.log("removal done")
                res.send("removal done");
            } catch (err) {
                console.log(err);
            }
        }
    })
    
    app.listen(process.env.PORT, () => {
        console.log("Server listening on port "+process.env.PORT);
    });
}

server();