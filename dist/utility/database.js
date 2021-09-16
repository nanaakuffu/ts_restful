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
const typeorm_1 = require("typeorm");
class DatabaseConnection {
    constructor() {
        this.connectionOptions = {
            type: "mongodb",
            database: "typeorm-test-db",
            synchronize: true,
            useUnifiedTopology: true,
            logging: false,
            entities: ["src/entity/*.ts"],
            migrations: ["src/migration/*.ts"],
            subscribers: ["src/subscriber/*.ts"],
            cli: {
                entitiesDir: "src/entity",
                migrationsDir: "src/migration",
                subscribersDir: "src/subscriber",
            },
        };
    }
    getDatabaseConnection(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
                connection = typeorm_1.getConnection(name);
                if (!connection.isConnected) {
                    connection = yield connection.connect();
                }
            }
            catch (err) {
                connection = yield typeorm_1.createConnection(this.connectionOptions);
            }
            return connection;
        });
    }
}
exports.default = DatabaseConnection;
// Usage
// Create this function in the class and call it in th constructor
// const connectDatabase = async () => {
//   this.dbConnection = await new DatabaseConnection().getDatabaseConnection(
//     "default"
//   );
//   this.userRepository = this.dbConnection.getMongoRepository(User);
// };
//# sourceMappingURL=database.js.map