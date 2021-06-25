'use strict'
require('dotenv').config();
require('./Connection/connect')
import express from 'express';
import morgan from 'morgan';

const v1 = require('./V1/router/index')
const app = express();
app.use(express.json());
app.get('/get',(req,res) =>res.send("ok"));
morgan.token('host', function (req, res) {
    return req.hostname;
});
app.use(morgan(':method :host:url  :status  :response-time ms'))
app.use("/v1", v1);
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    })
})
let server = app.listen(process.env.PORT, () => {
    console.log(`🚀 Server is running on ${process.env.PORT}........`);
})