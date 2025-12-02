// 400 Bad Request Error
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

// 401 Unauthorized Error
export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

// 403 Forbidden Error
export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
  }
}

// 404 Not Found Error
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}
