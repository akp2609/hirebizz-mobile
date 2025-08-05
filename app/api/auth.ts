import axiosInstance from './axiosInstance'

export const loginAPI = async (email: string, password: string) => {
  const res = await axiosInstance.post('/auth/login', { email, password })
  console.log(res.data)
  return res.data
}


export const registerAPI = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  const res = await axiosInstance.post('/auth/register', {
    name,
    email,
    password,
    role
  })
  return res.data
}

export const resetPasswordReq = async (email: string) => {
  const res = await axiosInstance.post('/auth/request-reset', email);
  return res.data
}