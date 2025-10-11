import { ApiError } from '../exceptions/api-error.js'

export default function (err, req, res, next) {
	if (err instanceof ApiError) {
		return res.status(err.status).json({ message: err.message, type: err.type, errors: err.errors })
	}

	res.status(500).json({
		message: 'Непредвиденная ошибка',
	})
}