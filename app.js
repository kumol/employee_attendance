const express = require("express");
require('dotenv').config()
const app = express();
const router = require('./server/api/index');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var cors = require('cors')
app.use(cors());
app.use(router);
require("./server/db/db");


app.listen(process.env.PORT, (err) => {
    console.log("Server is running http://localhost:" + process.env.PORT);
});

app.get("/", (req, res) => {
    res.send("Hello everyone");
});