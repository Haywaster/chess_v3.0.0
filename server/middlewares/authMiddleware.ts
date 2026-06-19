import { type RequestHandler } from 'express'

import { ApiError } from '../exceptions/api-error'
import { tokenService } from '../services/tokenService'

const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const fullTokenStr = req.headers.authorization

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
  } catch {
    next(ApiError.UnauthorizedError())
  }
}

export default authMiddleware
