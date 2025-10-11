import axios from 'axios'

export const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api`

export const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})
