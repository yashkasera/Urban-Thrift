class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.code = 404;
    this.message = "The resource you are looking for is not found.";
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.code = 400;
    this.message = "The request is invalid.";
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError";
    this.code = 401;
    this.message = message || "You are not authorized to perform this action.";
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.code = 403;
    this.message =
      "You are not authorized to perform this action. Forbidden action";
  }
}

module.exports = {
  NotFoundError,
  BadRequestError,
  AuthenticationError,
  ForbiddenError,
};
