"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const oAuthTokenSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: mongoose_1.Schema.Types.Mixed,
});
const OAuthToken = (0, mongoose_1.model)('OAuthToken', oAuthTokenSchema);
exports.default = OAuthToken;
