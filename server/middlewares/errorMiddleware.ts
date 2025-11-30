import { ApiError } from '../exceptions/api-error.ts'
import { ErrorRequestHandler  } from 'express'

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
	if (err instanceof ApiError) {
    const { errors, message, type } = err
		return res.status(err.status).json({ message, type, errors })
	}
 
	res.status(500).json({
		message: 'Непредвиденная ошибка',
    type: 'UnknownError',
	})

  next()
}

export default errorMiddleware