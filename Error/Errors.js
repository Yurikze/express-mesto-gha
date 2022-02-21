class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class NotValidError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotValidError";
    this.statusCode = 400;
  }
}

module.exports = { NotFoundError, NotValidError };
