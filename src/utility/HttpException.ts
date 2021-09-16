export class HttpException extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
