import axios, { type AxiosInstance } from 'axios'

export const createApi = (): AxiosInstance =>
  axios.create({
    baseURL: '/api',
    withCredentials: true
  })

export const rawApi = createApi()
