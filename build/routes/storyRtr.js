"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
const storyCtrl = __importStar(require("../controller/storyCtrl"));
const auth_1 = require("../middleware/auth");
router.get('/iamcollabing', auth_1.protect, storyCtrl.iamcollabing);
router.get('/my', auth_1.protect, storyCtrl.myStories);
router.route('/').get(storyCtrl.getAllStories);
router.use(auth_1.fetchAuth);
router.get('/:storyId', storyCtrl.getStoryById);
router.use(auth_1.protect);
router.patch(['/publishedmany', '/unpublishedmany'], storyCtrl.publishedMultipleStories);
router.patch(['/published/:storyId', '/unpublished/:storyId'], storyCtrl.publishedStory);
router.patch('/grade/:storyId', storyCtrl.gradeStory);
router.put('/uncollabmemany', storyCtrl.unCollabMeMultiple);
router.put('/uncollabme/:storyId', storyCtrl.unCollabMe);
router.put('/collab/:storyId', storyCtrl.collab);
router.post(['/initialize', '/init'], storyCtrl.initializeStory);
router.delete('/deletemany', storyCtrl.deleteMultipleStories);
router
    .route('/:storyId')
    .delete(storyCtrl.deleteStory)
    .put(storyCtrl.updateStory);
exports.default = router;
