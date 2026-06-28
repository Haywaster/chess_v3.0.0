import { type User } from '@prisma/client'
import { type RequestHandler } from 'express'

import { ApiError } from '../exceptions/api-error'
import { tokenService } from '../services/tokenService'

export const getUserData = (fullTokenStr: string | undefined): User | null => {
  if (!fullTokenStr) {
    return null
  }

  const token = fullTokenStr.replace(/^Bearer\s+/i, '')

  if (!token) {
    return null
  }

  const userData = tokenService.validateAccessToken(token)

  if (!userData) {
    return null
  }

  return userData
}

const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const fullTokenStr = req.headers.authorization
    const userData = getUserData(fullTokenStr)

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
