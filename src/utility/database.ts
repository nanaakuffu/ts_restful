import {
  Connection,
  ConnectionOptions,
  createConnection,
  getConnection,
} from "typeorm";

export default class DatabaseConnection {
  private connectionOptions: ConnectionOptions = {
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

  public async getDatabaseConnection(name: string): Promise<Connection> {
    let connection: Connection;

    try {
      connection = getConnection(name);
      if (!connection.isConnected) {
        connection = await connection.connect();
      }
    } catch (err) {
      connection = await createConnection(this.connectionOptions);
    }

    return connection;
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
