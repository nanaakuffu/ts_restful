import {
  Connection,
  ConnectionOptions,
  DataSource,
  createConnection,
  getConnection,
} from "typeorm";

export default class DatabaseConnection {
  private connectionOptions: DataSource = new DataSource({
    type: "mongodb",
    database: "typeorm-test-db",
    synchronize: true,
    useUnifiedTopology: true,
    logging: false,
    entities: ["src/entity/*.ts"],
    migrations: ["src/migration/*.ts"],
    subscribers: ["src/subscriber/*.ts"],
  });

  public async getDatabaseConnection(name: string): Promise<DataSource> {
    return await this.connectionOptions.initialize();
  }
}

// Usage
// Create this function in the class and call it in th constructor
// const connectDatabase = async () => {
//   this.dbConnection = await new DatabaseConnection().getDatabaseConnection(
//     "default"
//   );
//   this.userRepository = this.dbConnection.getMongoRepository(User);
// };
