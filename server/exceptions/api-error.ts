import { StatusCodes } from '@game-workspace/shared'

export class ApiError extends Error {
  status: number
  type: string
  errors: string[]

  constructor(
    status: number,
    message: string,
    type: string,
    errors: string[] = []
  ) {
    super(message)
    this.status = status
    this.type = type
    this.errors = errors
  }

  static UnauthorizedError(): ApiError {
    return new ApiError(
      StatusCodes.UNAUTHORIZED,
      'Пользователь не авторизован',
      'UnauthorizedError'
    )
  }

  static BadRequest(
    message: string,
    type: string,
    errors: string[] = []
  ): ApiError {
    return new ApiError(StatusCodes.CLIENT_ERROR, message, type, errors)
  }
}
