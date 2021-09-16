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
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordValidation = exports.loginValidation = exports.updateUserValidation = exports.createUserValidation = void 0;
const express_validator_1 = require("express-validator");
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
exports.createUserValidation = [
    express_validator_1.body("first_name")
        .trim()
        .exists()
        .withMessage("Please provide first name")
        .isString()
        .notEmpty(),
    express_validator_1.body("last_name")
        .trim()
        .exists()
        .withMessage("Please provide last name")
        .isAlpha()
        .withMessage("Only alphabets are accepted")
        .notEmpty(),
    express_validator_1.body("email")
        .trim()
        .exists()
        .withMessage("Please provide first name")
        .isEmail()
        .withMessage("Please provide a valid email.")
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield typeorm_1.getRepository(User_1.User).findOne({ email: value });
        if (user) {
            return Promise.reject("E-mail already in use");
        }
    })),
    express_validator_1.body("contact_number")
        .trim()
        .exists()
        .isMobilePhone("en-GH")
        .withMessage("This is not a valid Ghanaian mobile number.")
        .notEmpty(),
    express_validator_1.body("password")
        .exists()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must contain at least 6 characters")
        .notEmpty(),
    express_validator_1.body("confirm_password")
        .exists()
        .custom((value, { req }) => value === req.body.password)
        .withMessage("Confirm password field must have the same value as the password field"),
];
exports.updateUserValidation = [
    express_validator_1.body("first_name").trim().optional().isString(),
    express_validator_1.body("last_name").trim().optional().isString(),
    express_validator_1.body("email")
        .trim()
        .optional()
        .isEmail()
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield typeorm_1.getRepository(User_1.User).findOne({ email: value });
        if (user) {
            return Promise.reject("E-mail already in use");
        }
    })),
    express_validator_1.body("contact_number")
        .trim()
        .optional()
        .isMobilePhone("en-GH")
        .withMessage("This is not a valid Ghanaian mobile number."),
];
exports.loginValidation = [
    express_validator_1.body("email")
        .trim()
        .exists()
        .withMessage("Please your email required.")
        .notEmpty(),
    express_validator_1.body("password").exists().withMessage("Password is required.").notEmpty(),
];
exports.changePasswordValidation = [
    express_validator_1.body("currentPassword")
        .exists()
        .withMessage("Current password is required.")
        .notEmpty(),
    express_validator_1.body("newPassword")
        .exists()
        .withMessage("New password is required")
        .notEmpty(),
    express_validator_1.body("confirmNewPassword")
        .exists()
        .custom((value, { req }) => value === req.body.newPassword)
        .withMessage("Confirm password field must have the same value as the new password field"),
];
//# sourceMappingURL=userValidation.js.map