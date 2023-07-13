import { ConnectionOptions, DataSource } from "typeorm";
import { join } from "path";

export const enum configOptions {
  MONGO_PATH = "mongodb://localhost/typeorm-test-db",
  API_URL = "/api/v1",
  SUCCESS_MESSAGE = "Request completed successfully",
}

export const dataSource: DataSource = new DataSource({
  type: "mongodb",
  host: "localhost",
  database: "typeorm-test-db",
  synchronize: true,
  useUnifiedTopology: true,
  logging: false,
  entities: [join(__dirname, "../entity/*.*")],
  migrations: [join(__dirname, "../migration/*.*")],
  subscribers: [join(__dirname, "../subscriber/*.*")],
});
