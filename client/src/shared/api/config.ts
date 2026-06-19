import { useAuthStore } from 'features/auth'

import { setupInterceptors } from './interceptors'
import { createApi } from './rawApi'

const api = createApi()

export default setupInterceptors(api, useAuthStore)
