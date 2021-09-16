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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.auth = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
const HttpException_1 = require("../utility/HttpException");
const auth = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorizationHeader = request.headers.authorization;
        const token = authorizationHeader &&
            authorizationHeader.startsWith("Bearer") &&
            authorizationHeader.split(" ")[1];
        if (!token) {
            throw new HttpException_1.HttpException(401, "Unauthenticated: No token on header.");
        }
        const secretKey = process.env.SECRET_JWT || "";
        // const verifyToken = <jwt.JwtPayload>jwt.verify(token, secretKey);
        jwt.verify(token, secretKey, (err, verifyToken) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                next(new HttpException_1.HttpException(401, "Unauthenticated: Token expired."));
            }
            const user = yield typeorm_1.getRepository(User_1.User).findOne(verifyToken === null || verifyToken === void 0 ? void 0 : verifyToken.user_id);
            if (!user) {
                next(new HttpException_1.HttpException(401, "Unauthenticated: Access denied."));
            }
            const _a = user, { password } = _a, userDataWithoutPassword = __rest(_a, ["password"]);
            response.locals.user = userDataWithoutPassword;
            next();
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.auth = auth;
// Middleware to check if current user is an Admin or not
const isAdmin = (request, response, next) => {
    try {
        const roleId = response.locals.user.role_id;
        if (roleId !== 2) {
            throw new HttpException_1.HttpException(403, "Unauthorized for this action.");
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=auth.js.map