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
const pagination_1 = __importDefault(require("../../lib/pagination"));
const utils_1 = require("../../lib/utils");
const Story_1 = __importDefault(require("../../models/Story"));
const getAllStoriesTemp = (0, utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let queryClone = JSON.stringify(Object.assign(Object.assign({}, req.query), { isPublished: true, isPublishedByAdmin: true, hadEmailedToFollowers: true }));
    queryClone = queryClone.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
    queryClone = JSON.parse(queryClone);
    Object.keys(queryClone).forEach((key) => {
        var _a;
        let temp = (_a = queryClone[key]) === null || _a === void 0 ? void 0 : _a.$in;
        if (temp) {
            delete queryClone[key];
            if (typeof temp == 'string')
                queryClone[key] = { $in: temp.split(',') };
        }
    });
    const regExFields = ['title', 'subtitle', 'content', 'keywords'];
    regExFields.forEach((field) => {
        var _a;
        if (queryClone[field]) {
            queryClone.$or = (_a = queryClone.$or) !== null && _a !== void 0 ? _a : [];
            queryClone.$or.push({
                [field]: new RegExp(`${queryClone[field]}`, 'gi'),
            });
        }
        delete queryClone[field];
    });
    const queryRef = Story_1.default.find(queryClone)
        .select('-content -collabWith')
        .populate([
        {
            path: 'author',
            select: 'username email fullName',
        },
        {
            path: 'tags',
            select: 'title',
        },
    ]);
    if (typeof queryClone.select == 'string')
        queryRef.select(queryClone.select.split(',').join(' '));
    delete queryClone.select;
    (0, pagination_1.default)(req, res, next, {
        query: queryRef,
        label: 'stories',
    });
}));
exports.default = getAllStoriesTemp;
