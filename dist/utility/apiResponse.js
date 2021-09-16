"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiResponse = void 0;
const apiResponse = (response, message = "Request completed successfully", data, statusCode = 200) => {
    const response_message = {
        status: statusCode,
        message: message,
        data: data,
    };
    response.status(statusCode).send({ response_message });
};
exports.apiResponse = apiResponse;
//# sourceMappingURL=apiResponse.js.map