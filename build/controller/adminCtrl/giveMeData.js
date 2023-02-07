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
const utils_1 = require("../../lib/utils");
const User_1 = __importDefault(require("../../models/User"));
const Story_1 = __importDefault(require("../../models/Story"));
const giveMeData = (0, utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let users = null;
    let stories = null;
    const author = req.user._id.toString();
    const reqQuery = typeof ((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.data) == 'string' ? (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.data.split(',') : [];
    const giveMeStories = reqQuery.filter((val) => ['story', 'stories'].includes(val)).length;
    if (giveMeStories)
        stories = Story_1.default.find({ author: { $nin: author } })
            .select('-content')
            .populate([
            {
                path: 'author',
                select: 'username',
            },
            {
                path: 'collabWith',
                select: 'username email fullName',
            },
        ])
            .lean();
    const giveMeUsers = reqQuery.filter((val) => ['user', 'users'].includes(val)).length;
    if (giveMeUsers)
        users = User_1.default.find({ _id: { $nin: author } }).lean();
    return res.status(200).json({
        success: 200,
        users: !users ? [] : yield users,
        stories: !stories ? [] : yield stories,
    });
}));
exports.default = [giveMeData];
