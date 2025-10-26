import type { User } from './scheme.ts'

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};