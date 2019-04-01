const mongoose = require('mongoose');
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");

const config = require("./config");
const app = express();
const port = process.env.PORT || 8000;

const DB = (process.env.NODE_ENV == "test") ? config.LOCAL_DB : config.REMOTE_DB;

mongoose.connect(DB, (err) => {
    if (err)
        console.error("Error occured while connecting to the Database !");
    else
        console.log("Connection established to the database successfully...");
});

if (process.env.NODE_ENV != "test") {
    app.use(logger("dev"));
}

app.get("/health-check", (req, res) => {
    res.json({
        meta: {
            success: true,
            message: "Healthcheck done. Server is running!",
            code: 200
        }
    })
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(helmet());
app.use(compression());

app.use((err, req, res, next) => {
    const message = err.message;
    const error = req.app.get('env') === 'development' ? err : {};
    const status = err.status || 500;
    res.status(status);
    res.json({error , message});
});

app.listen(port);
console.log(`Server running successfully on port number: ${port}...`);
module.exports = app;
    