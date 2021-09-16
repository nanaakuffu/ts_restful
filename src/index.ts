import app from "./app";
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/.env" });

const port: number | string = process.env.PORT as string | number;

app.listen(port, () => {
  console.log(`Server started and listening on port: ${port}`);
});
