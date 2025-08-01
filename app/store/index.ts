import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice'
import jobsReducer from '../features/jobs/jobSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    jobs: jobsReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
