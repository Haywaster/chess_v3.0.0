import type { User } from './scheme'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export {}
