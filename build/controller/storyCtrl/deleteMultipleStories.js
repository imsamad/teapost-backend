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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../lib/utils");
const yup = __importStar(require("yup"));
const validateSchemaMdlwr_1 = __importDefault(require("../../middleware/validateSchemaMdlwr"));
const Story_1 = __importDefault(require("../../models/Story"));
const mongoose_1 = require("mongoose");
const deleteMultipleStories = (0, utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const author = req.user._id.toString();
    const stories = yield Story_1.default.find({
        author,
        _id: { $in: [...new Set(req.body.storyIds)] },
    });
    if (!stories.length)
        return next((0, utils_1.ErrorResponse)(400, 'Resource not found'));
    const promiseResolved = yield Promise.allSettled(stories.map((story) => story.remove()));
    return res.json({
        stories: promiseResolved
            .filter((story) => story.status == 'fulfilled')
            .map((promise) => promise === null || promise === void 0 ? void 0 : promise.value),
    });
}));
const schema = yup.object({
    body: yup.object({
        storyIds: yup
            .array()
            .label('storyIds')
            .required()
            .typeError('StoryIds must be array of storyId')
            .of(yup
            .string()
            .label('storyIds')
            .test('storyIds', 'Provide valid storyIds', mongoose_1.isValidObjectId))
            .min(1),
    }),
});
exports.default = [(0, validateSchemaMdlwr_1.default)(schema), deleteMultipleStories];
