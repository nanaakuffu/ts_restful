"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const HttpException_1 = require("../utility/HttpException");
class BaseController {
    constructor() {
        this.checkValidation = (request) => {
            const errorFormatter = ({ location, msg, param, value, }) => {
                // Build your resulting errors however you want! String, object, whatever - it works!
                // return `${location}[${param}]: ${msg}`;
                return { location, param, msg };
            };
            const errors = express_validator_1.validationResult(request).formatWith(errorFormatter);
            if (!errors.isEmpty()) {
                throw new HttpException_1.HttpException(422, "Validation failed", errors.mapped());
            }
        };
        this.apiResponse = (response, message, statusCode = 200, data) => {
            const response_message = {
                status: statusCode,
                message: message,
                data: data,
            };
            response.status(statusCode).send(response_message);
        };
    }
}
exports.default = BaseController;
//# sourceMappingURL=baseController.js.map