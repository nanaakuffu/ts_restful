"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const baseRoute_1 = require("../globals/baseRoute");
const ProductController_1 = __importDefault(require("../controllers/ProductController"));
class ProductRoutes extends baseRoute_1.BaseRoute {
    constructor(dbConnection) {
        super();
        this.productController = new ProductController_1.default(dbConnection);
        this.router = express_1.Router();
        this.routes();
    }
    /**
     * routes
     */
    routes() {
        // Contact
        this.router.get("/", this.productController.getAllData);
        this.router.post("/", this.productController.addNew);
        this.router.get("/:contactId", this.productController.showData);
        this.router.put("/:contactId", this.productController.updateData);
        this.router.delete("/:contactId", this.productController.deleteData);
    }
}
exports.default = ProductRoutes;
//# sourceMappingURL=productRoutes.js.map