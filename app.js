const express = require('express');
const app = express();
const PORT = 9090;

require("./db_config")
const API_ROUTER = require('./api_route')

// Importing third party middleware
const morgan = require('morgan')
const cors = require('cors')

// Loading third party middleware
app.use(morgan('dev'))
app.use(cors())

// Loading inbuilt middleware
app.use(express.static('uploads')) //Serves static files
app.use(express.urlencoded({ //Parser for x-ww-form-urlencoded
    extended: true
}))
app.use(express.json()); //JSON parser
app.use('/api', API_ROUTER)

// 404 error handler
app.use(function(req, res, next) {
    next({
        msg: "Page Not Found",
        status: 404
    })
})

// Error handler middleware
app.use(function(err, req, res, next) {
    res.status(err.status || 400);
    res.json({
        msg: err.msg || err,
        status: err.status || 400
    })
})

app.listen(PORT, function(err, done) {
    if (err) {
        console.log("Server listening failed ", err);
    } else {
        console.log("Server listening to PORT ", PORT);
    }
})