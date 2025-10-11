export class ApiError extends Error {
	status
	errors

	constructor(status, message, type, errors = []) {
		super(message);
		this.status = status
		this.errors = errors
		this.type = type
	}

	static UnauthorizedError() {
		return new ApiError(401,  'Пользователь не авторизован')
	}

	static BadRequest(message, type, errors = []) {
		return new ApiError(400, message, type, errors)
	}
}
