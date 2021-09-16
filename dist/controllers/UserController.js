"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const User_1 = require("../entity/User");
const baseController_1 = __importDefault(require("../globals/baseController"));
const HttpException_1 = require("../utility/HttpException");
class UserController extends baseController_1.default {
    constructor(dbConnection) {
        super();
        this.loginUser = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Check validation
                this.checkValidation(request);
                const { email, password: userPassword } = request.body;
                // Find user by the email
                const user = yield this.userRepository.findOne({ email });
                if (!user) {
                    throw new HttpException_1.HttpException(401, "Incorrect e-mail or password!");
                }
                // Check for password correctness
                const passwordIsMatching = yield bcrypt.compare(userPassword, user.password);
                if (!passwordIsMatching) {
                    throw new HttpException_1.HttpException(401, "Incorrect e-mail or password!");
                }
                // If user matched with password assign a token for logging in
                const secretKey = process.env.SECRET_JWT || "";
                const token = jwt.sign({ user_id: user.id }, secretKey, {
                    expiresIn: "24h",
                });
                // Provide a data for response without the password
                const { password } = user, restOfData = __rest(user, ["password"]);
                // Respond with the correct user details
                this.apiResponse(response, "Login successful", 200, Object.assign(Object.assign({}, restOfData), { token }));
            }
            catch (error) {
                // Send error to the error broker
                next(error);
                // console.log(error);
            }
        });
        this.changePassword = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.checkValidation(request);
                const user = yield this.userRepository.findOne(response.locals.user.user_id);
                if (!user) {
                    throw new HttpException_1.HttpException(401, "Unauthenticated.");
                }
                // Check for password correctness
                const passwordIsMatching = yield bcrypt.compare(request.body.currentPassword, user.password);
                if (!passwordIsMatching) {
                    throw new HttpException_1.HttpException(401, "Incorrect password!");
                }
                if (request.body.newPassword) {
                    request.body.newPassword = yield bcrypt.hash(request.body.newPassword, 8);
                }
                this.userRepository.update(user.id, {
                    password: request.body.newPassword,
                });
                this.apiResponse(response, "Password changed successfully!", 200);
            }
            catch (error) {
                next(error);
            }
        });
        this.createUser = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.checkValidation(request);
                if (request.body.password) {
                    request.body.password = yield bcrypt.hash(request.body.password, 8);
                }
                const _a = request.body, { confirm_password } = _a, dataToSave = __rest(_a, ["confirm_password"]);
                yield this.userRepository.save(dataToSave);
                this.apiResponse(response, "User was created!", 201);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateUser = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.checkValidation(request);
                let newUser = yield this.userRepository.update(request.params.user_id, request.body);
                this.apiResponse(response, "User was successfully updated!", 200);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteUser = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userRepository.delete(request.params.user_id);
                this.apiResponse(response, "Request completed successfully" /* SUCCESS_MESSAGE */, 200);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllUsers = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userRepository.find({});
                const dataWithoutPassword = users.map((element) => {
                    const { password } = element, restOfData = __rest(element, ["password"]);
                    return restOfData;
                });
                this.apiResponse(response, "Request completed successfully" /* SUCCESS_MESSAGE */, 200, dataWithoutPassword);
            }
            catch (error) {
                next(error);
            }
        });
        this.getUserInformation = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = (yield this.userRepository.findOne(request.params.user_id));
                const { password } = user, restOfData = __rest(user, ["password"]);
                this.apiResponse(response, "Request completed successfully" /* SUCCESS_MESSAGE */, 200, restOfData);
            }
            catch (error) {
                next(error);
            }
        });
        this.userRepository = dbConnection.getMongoRepository(User_1.User);
    }
    logOutUser(request, response, next) {
        throw new Error("Method not implemented.");
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map