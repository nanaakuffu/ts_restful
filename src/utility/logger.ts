import { createWriteStream, WriteStream } from "fs";

// create a write stream (in append mode)
export const logServerAccess = (logFilePath: string): WriteStream => {
  const accessLogStream: WriteStream = createWriteStream(logFilePath, {
    flags: "a",
  });

  return accessLogStream;
};

export const logServerErrors = (logFilePath: string): WriteStream => {
  //   const errorLogStream = logger.stream;
  const errorLogStream: WriteStream = createWriteStream(logFilePath, {
    flags: "a",
  });

  return errorLogStream;
};
