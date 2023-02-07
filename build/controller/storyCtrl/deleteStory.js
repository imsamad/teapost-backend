"use strict";
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
const yup_1 = require("yup");
const mongoose_1 = require("mongoose");
const validateSchemaMdlwr_1 = __importDefault(require("../../middleware/validateSchemaMdlwr"));
const utils_1 = require("../../lib/utils");
const Story_1 = __importDefault(require("../../models/Story"));
const ctrl = (0, utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const storyIds = req.params.storyId == 'multiple'
        ? (_a = req.body) === null || _a === void 0 ? void 0 : _a.storyIds
        : [req.params.storyId];
    if (!(storyIds === null || storyIds === void 0 ? void 0 : storyIds.length))
        return next((0, utils_1.ErrorResponse)(400, 'Provide storyIds'));
    const author = req.user._id.toString();
    const stories = yield Story_1.default.find({ _id: { $in: storyIds }, author }).select('-content');
    if (!stories.length) {
        return next((0, utils_1.ErrorResponse)(400, 'Resource not found'));
    }
    const storiesDeleted = yield Promise.allSettled(stories.map((story) => story.remove()));
    return res.json({
        stories: storiesDeleted
            .filter((resolve) => resolve.status == 'fulfilled')
            .map((resolve) => resolve.value),
    });
}));
const schema = (0, yup_1.object)({
    params: (0, yup_1.object)({
        storyId: (0, yup_1.string)()
            .label('storyId')
            .typeError('StoryId must be string type.')
            .test('storyId', 'Story Id must be a valid', (val) => val == 'multiple' ? true : (0, mongoose_1.isValidObjectId)(val)),
    }),
    body: (0, yup_1.object)({
        storyIds: (0, yup_1.array)()
            .label('storyIds')
            .typeError('To delete multiple proide array of storyIds')
            .test('storyId', 'To delete multiple proide array of storyIds', (val) => !val ? true : (0, utils_1.typeOf)(val, 'array') && val.every(mongoose_1.isValidObjectId)),
    }),
})
    .label('body')
    .test('body', 'Provide proper story id', (val) => {
    if (val.params.storyId == 'multiple')
        return val.body.storyIds && (0, utils_1.typeOf)(val.body.storyIds, 'array');
    return true;
});
exports.default = [(0, validateSchemaMdlwr_1.default)(schema), ctrl];
