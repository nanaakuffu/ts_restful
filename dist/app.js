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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const config_1 = require("./config");
const HttpException_1 = require("./utility/HttpException");
class App {
    constructor() {
        this.apiUrl = "/api/v1" /* API_URL */;
        this.middlewares = () => {
            // Enable helmet to protect the api headers
            this.app.use(helmet_1.default());
            // Support application/json type post data
            this.app.use(express_1.default.json());
            // Support application/x-www-form-urlencoded post data
            this.app.use(express_1.default.urlencoded({ extended: false }));
            // Enable CORS
            this.app.use(cors_1.default());
            // Adding morgan to log http request
            this.app.use(morgan_1.default("combined"));
            this.app.use(cookie_parser_1.default());
        };
        this.databaseConnectionSetup = () => __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.createConnection(config_1.connectionOptions)
                .then((connection) => {
                console.log("Database Connected");
                if (connection) {
                    this.routes(connection);
                    this.notFoundUrl();
                    this.app.use(this.generalErrorHandler);
                }
            })
                .catch((error) => console.log(error));
        });
        this.notFoundUrl = () => {
            this.app.all("*", (request, response, next) => {
                const err = new HttpException_1.HttpException(404, `Url not found`);
                next(err);
            });
        };
        this.generalErrorHandler = (error, request, response, next) => {
            let { status = 500, message, data } = error;
            console.log(`${error}`);
            // If status code is 500 - change the message to Intrnal server error
            // message = status === 500 || !message ? "Internal server error" : message;
            error = Object.assign({ type: "error", method: request.method, url: request.url, status,
                message }, (data && data));
            response.status(status).send(error);
        };
        this.app = express_1.default();
        this.middlewares();
        this.databaseConnectionSetup();
    }
    routes(connection) {
        // Product routes
        this.app.use(`${this.apiUrl}/products`, new productRoutes_1.default(connection).router);
        // User routes
        this.app.use(`${this.apiUrl}/auth`, new userRoutes_1.default(connection).router);
    }
}
const expressApp = new App();
exports.default = expressApp.app;
//# sourceMappingURL=app.js.map