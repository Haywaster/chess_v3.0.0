import { tokenService } from '../services/tokenService.js';
import { ApiError } from '../exceptions/api-error.js'

export default function (req, res, next) {
	try {
		const fullTokenStr = req.headers.authorization;

		if (!fullTokenStr) {
			return next(ApiError.UnauthorizedError())
		}

		const token = fullTokenStr.replace(/^Bearer\s+/i, '')

    if (!token) {
			return next(ApiError.UnauthorizedError())
		}

		const userData = tokenService.validateAccessToken(token)

    if (!userData) {
			return next(ApiError.UnauthorizedError())
		}

		req.user = userData
		next()
	} catch (e) {
		next(ApiError.UnauthorizedError())
	}
}
