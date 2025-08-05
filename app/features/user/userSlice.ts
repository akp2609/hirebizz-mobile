import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  _id: string
  name: string
  email: string
  password?: string
  bio?: string
  location?: string
  authProvider: 'local' | 'google' | 'github'
  providerId?: string
  profilePicture: string
  isVerified: boolean
  role: 'candidate' | 'employer' | 'admin' | 'superadmin'
  token: string
  isEmailVerified: boolean
  isPremiumUser: boolean
  appliedJobs: []

  company?: {
    name?: string
    website?: string
    logo?: string
  }

  resumeURL?: string
  objectName?: string
  savedJobs: string[]

  createdAt: string
  updatedAt: string
}

interface UserState {
  user: User | null
}

const initialState: UserState = {
  user: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    logout(state) {
      state.user = null
    },
  },
})

export const { loginSuccess, logout } = userSlice.actions
export default userSlice.reducer
