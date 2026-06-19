import { type ErrorRequestHandler } from 'express'

import { Statuses } from '../const'
import { ApiError } from '../exceptions/api-error'

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    const { errors, message, type } = err
    return res.status(err.status).json({ message, type, errors })
  }

  res.status(Statuses.SERVER_ERROR).json({
    message: 'Непредвиденная ошибка',
    type: 'UnknownError'
  })

  next()
}

export default errorMiddleware
