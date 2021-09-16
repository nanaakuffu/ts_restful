# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command

{
type: "mongodb",
database: "typeorm-test-db",
synchronize: true,
useUnifiedTopology: true,
logging: false,
entities: [__dirname + "/entity/*.ts"],
migrations: [__dirname + "/migration/*.ts"],
subscribers: [__dirname + "/subscriber/*.ts"],
cli: {
entitiesDir: "src/entity",
migrationsDir: "src/migration",
subscribersDir: "src/subscriber",
},
}
