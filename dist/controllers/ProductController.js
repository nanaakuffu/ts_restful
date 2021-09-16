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
const baseController_1 = __importDefault(require("../globals/baseController"));
const Product_1 = __importDefault(require("../entity/Product"));
class ProductController extends baseController_1.default {
    constructor(connection) {
        super();
        this.addNew = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const contact = yield this.testRepository.save(request.body);
                this.apiResponse(response, "Request completed successfully" /* SUCCESS_MESSAGE */, 201, contact);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllData = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const contact = yield this.testRepository.find({});
                this.apiResponse(response, "Request completed successfully" /* SUCCESS_MESSAGE */, 200, contact);
            }
            catch (error) {
                next(error);
            }
        });
        this.showData = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const contact = yield this.testRepository.findOne(request.params.contactId);
                this.apiResponse(response, "Request completed successfully" /* SUCCESS_MESSAGE */, 200, contact);
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * updateData
         */
        this.updateData = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const contact = yield this.testRepository.update(request.params.contactId, request.body);
                this.apiResponse(response, "Request completed successfully" /* SUCCESS_MESSAGE */, 200, contact);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteData = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.testRepository.delete(request.params.contactId);
                this.apiResponse(response, "Request completed successfully" /* SUCCESS_MESSAGE */, 200);
            }
            catch (error) {
                next(error);
            }
        });
        this.testRepository = connection.getRepository(Product_1.default);
    }
}
exports.default = ProductController;
//# sourceMappingURL=ProductController.js.map