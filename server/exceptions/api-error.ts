export class ApiError extends Error {
  status: number
  type: string
  errors: string[]
  
	constructor(status: number, message: string, type: string, errors: string[] = []) {
		super(message);
		this.status = status
		this.type = type
		this.errors = errors
	}

	static UnauthorizedError() {
		return new ApiError(401,  'Пользователь не авторизован', 'UnauthorizedError')
	}

	static BadRequest(message: string, type: string, errors: string[] = []) {
		return new ApiError(400, message, type, errors)
	}
}
