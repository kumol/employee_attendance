const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL, (err) => {
    err ? console.log(err) : console.log("connected");
})