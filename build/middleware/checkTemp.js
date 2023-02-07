"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkTemp = (msg = 'I Run') => (_req, _res, next) => {
    console.log('body', _req.body);
    console.log('originalUrl ', _req.originalUrl);
    console.log('params', _req.params);
    console.log('query', _req.query);
    next();
};
exports.default = checkTemp;
