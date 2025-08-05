import axios from 'axios'
import { store } from '../store'

const axiosInstance = axios.create({
  baseURL: 'https://api.hirebizz.xyz/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const state = store.getState()
  const token = state.user.user?.token

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default axiosInstance
