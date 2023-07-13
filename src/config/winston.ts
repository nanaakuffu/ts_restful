import { join } from "path";
import winston, { createLogger, format, transports } from "winston";

// creates a new Winston Logger
export const logger: winston.Logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
    format.errors({ stack: true }),
    format.printf(
      (info) =>
        `[${format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" })}]: ${
          info.message
        }`
    )
  ),
  transports: [
    new transports.File({
      filename: join(__dirname, "../logs/errors.log"),
      level: "error",
    }),
    new transports.Console({
      level: "debug",
      format: format.colorize(),
    }),
  ],
  handleExceptions: true,
  exitOnError: false,
});
