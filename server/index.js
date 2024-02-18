const mysql = require("mysql2");
const express = require("express");
const app = express();
const port = 8000;


app.get("/", (req, res) => {
    res.send("");
});

app.listen(port, () => {
    console.log("Server listening on port "+port);
})


