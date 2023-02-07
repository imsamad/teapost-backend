"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminCtrl_1 = __importDefault(require("../controller/adminCtrl"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.default)();
router.use(auth_1.protect, (0, auth_1.authorise)(['admin']));
router.get(['/giveMeData', '/'], adminCtrl_1.default.giveMeData);
router
    .route(['/block', '/unblock', '/blockusers', '/unblockusers'])
    .put(adminCtrl_1.default.blockUnBlockUsers);
router
    .route(['/publish', '/unpublish', '/publishstories', '/unpublishstories'])
    .put(adminCtrl_1.default.publishUnPublishStories);
exports.default = router;
