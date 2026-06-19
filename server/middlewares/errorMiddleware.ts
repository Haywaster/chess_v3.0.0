import { type ErrorRequestHandler } from 'express'

import { StatusCodes } from '@game-workspace/shared'

import { ApiError } from '../exceptions/api-error'

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    const { errors, message, type } = err
    return res.status(err.status).json({ message, type, errors })
  }

  res.status(StatusCodes.SERVER_ERROR).json({
    message: 'Непредвиденная ошибка',
    type: 'UnknownError'
  })

  next()
}

export default errorMiddleware
