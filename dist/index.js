"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: __dirname + "/.env" });
const port = process.env.PORT;
app_1.default.listen(port, () => {
    console.log(`Server started and listening on port: ${port}`);
});
//# sourceMappingURL=index.js.map