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
const mongoose_1 = __importDefault(require("mongoose"));
require("colors");
const connectDB = (setOptions = false) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    const mongoUri = process.env.MONGODB_URI;
    const oneMin = 1000 * 60;
    const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: oneMin * 5,
        socketTimeoutMS: oneMin * 5,
    };
    mongoose_1.default.connect(mongoUri, setOptions ? options : {});
    const db = mongoose_1.default.connection;
    let isDisconnected = false;
    db.on("connected", () => {
        resolve(true);
        console.log(`):- MongoDB connected successfully!`.blue.italic);
    });
    db.on("error", (err) => {
        reject(false);
        if (isDisconnected)
            return;
        isDisconnected = true;
        console.log(`\n):-MongoDB Error - ${err.message}`.red.underline.bold);
    });
    db.on("disconnected", () => {
        reject(false);
        if (isDisconnected)
            return;
        isDisconnected = true;
        console.log(`\n):- MongoDB connection is disconnected...`.red.underline.bold);
    });
    const closeDB = () => {
        if (isDisconnected)
            return;
        isDisconnected = true;
        db.close(() => {
            console.log(`):- MongoDB is disconnecting due to node app exit...`.red.underline
                .bold);
            process.exit(0);
        });
    };
    process.on("SIGINT", closeDB);
    process.on("exit", closeDB);
    process.on("beforeExit", closeDB);
}));
exports.default = connectDB;
