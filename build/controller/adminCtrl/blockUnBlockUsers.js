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
const mongoose_1 = require("mongoose");
const User_1 = __importDefault(require("../../models/User"));
const blockUnBlockUsers = (0, utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isBlock = (_a = req.originalUrl.split('/').pop()) === null || _a === void 0 ? void 0 : _a.startsWith('block');
    const admin = req.user._id.toString();
    if (isBlock && req.body.userIds.includes(admin) && !req.body.blockMySelf) {
        return next((0, utils_1.ErrorResponse)(400, `If you want to block yourself to then set blockMySelf field in body header as true and mention your unique userId in userIds array.`));
    }
    const users = yield User_1.default.updateMany({ _id: { $in: req.body.userIds } }, { isAuthorised: isBlock ? false : true });
    return res.status(200).json({
        success: 200,
        message: 'Users have been blocked',
    });
}));
const schema = yup.object({
    body: yup.object({
        userIds: yup
            .array()
            .label('userIds')
            .required()
            .typeError('userIds must be array of userId')
            .of(yup
            .string()
            .label('userIds')
            .test('userIds', 'Provide valid userIds', mongoose_1.isValidObjectId))
            .min(1),
        blockMySelf: yup.boolean().nullable(),
    }),
});
exports.default = [(0, validateSchemaMdlwr_1.default)(schema), blockUnBlockUsers];
