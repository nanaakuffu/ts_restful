"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionOptions = void 0;
exports.connectionOptions = {
    type: "mongodb",
    host: "localhost",
    database: "typeorm-test-db",
    synchronize: true,
    useUnifiedTopology: true,
    logging: false,
    entities: [__dirname + "/entity/*.*"],
    migrations: [__dirname + "/migration/*.*"],
    subscribers: [__dirname + "/subscriber/*.*"],
    cli: {
        entitiesDir: "src/entity",
        migrationsDir: "src/migration",
        subscribersDir: "src/subscriber",
    },
};
//# sourceMappingURL=config.js.map