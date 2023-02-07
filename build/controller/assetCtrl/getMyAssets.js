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
const Asset_1 = __importDefault(require("../../models/Asset"));
const getMyAssets = (0, utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let assets = yield Asset_1.default.findById(req.user._id).lean();
    const type = req.originalUrl.split('/').pop();
    const allowedTypes = ['images', 'videos', 'raws', 'audios'];
    if (type && allowedTypes.includes(type)) {
        return res.json({ result: (assets === null || assets === void 0 ? void 0 : assets[type]) || [] });
    }
    res.status(200).json({ assets: assets || {} });
}));
exports.default = getMyAssets;
