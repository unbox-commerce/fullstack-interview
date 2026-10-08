export abstract class AppError extends Error {
  abstract readonly status: 400 | 401 | 403 | 404 | 409 | 500;
}

export class ValidationError extends AppError {
  readonly status = 400;
}

export class AuthorisationError extends AppError {
  readonly status = 401;
}

export class ForbiddenError extends AppError {
  readonly status = 403;
}

export class NotFoundError extends AppError {
  readonly status = 404;
}
