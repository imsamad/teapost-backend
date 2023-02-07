"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const os_1 = __importDefault(require("os"));
const Router = express_1.default.Router();
const authRtr_1 = __importDefault(require("./authRtr"));
const storyRtr_1 = __importDefault(require("./storyRtr"));
const collectionRtr_1 = __importDefault(require("./collectionRtr"));
const userRtr_1 = __importDefault(require("./userRtr"));
const storyHistoryRtr_1 = __importDefault(require("./storyHistoryRtr"));
const tagRtr_1 = __importDefault(require("./tagRtr"));
const commentRtr_1 = __importDefault(require("./commentRtr"));
const assetRtr_1 = __importDefault(require("./assetRtr"));
const adminRtr_1 = __importDefault(require("./adminRtr"));
Router.use('/api/v1/stories', storyRtr_1.default);
Router.use('/api/v1/auth', authRtr_1.default);
Router.use('/api/v1/collections', collectionRtr_1.default);
Router.use('/api/v1/users', userRtr_1.default);
Router.use('/api/v1/storyhistories', storyHistoryRtr_1.default);
Router.use('/api/v1/tags', tagRtr_1.default);
Router.use('/api/v1/comments', commentRtr_1.default);
Router.use('/api/v1/assets', assetRtr_1.default);
Router.use('/api/v1/admin', adminRtr_1.default);
const numOfCpu = os_1.default.cpus().length;
Router.use(['/api/v1/health/', '/api/v1/'], (_req, res) => {
    return res.json({
        status: 'running[||]',
        num: numOfCpu,
        message: 'I am running & every thing is honkey-dorry.',
    });
});
exports.default = Router;
