"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../lib/utils");
require("colors");
const errorHandler = (err, _req, res, _next) => {
    console.log(`${(0, utils_1.stars)(4)} Error from error middleware ${(0, utils_1.stars)(4)}`.red);
    if (!Object.values(err).length) {
        console.log(err);
    }
    else
        console.log(`${JSON.stringify(err, null, 4)}`.red);
    console.log(`${(0, utils_1.stars)(10)}`.red);
    let error = Object.assign({}, err);
    if (typeof err == 'string')
        error = { message: err };
    if (err.name === 'ValidationError') {
        const inValidFields = Object.keys(err.errors);
        error = {
            message: {
                reason: 'Data are not valid for these fields.',
                fields: inValidFields,
            },
            statusCode: 400,
        };
    }
    if (err.name === 'CastError') {
        const message = `Resource not found`;
        error = { message, statusCode: 404 };
    }
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 404 };
    }
    if (err.name === 'TypeError') {
        const message = `Invalid data`;
        error = { message, statusCode: 404 };
    }
    return res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message ||
            'Server is on maintenance right now, soory for delay in service, please try again',
    });
};
exports.default = errorHandler;
