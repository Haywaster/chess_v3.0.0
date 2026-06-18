import { useUserStore } from 'entities/User'

import { setupInterceptors } from './interceptors'
import { createApi } from './rawApi'

const api = createApi()

export default setupInterceptors(api, useUserStore)
