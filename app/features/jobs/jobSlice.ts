import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchJobs } from '../../api/jobs'
import { getPostedJobs } from '../../api/employer'

interface JobsState {
  jobs: any[]
  loading: boolean
  error: string | null
}

const initialState: JobsState = {
  jobs: [],
  loading: false,
  error: null,
}

export const fetchCandidateJobs = createAsyncThunk('jobs/fetchCandidateJobs', async () => {
  const jobs = await fetchJobs()
  return jobs
})

export const fetchEmployerJobs = createAsyncThunk('jobs/fetchEmployerJobs', async () => {
  const res = await getPostedJobs()
  return res.jobs
})

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearJobs: (state) => {
      state.jobs = []
      state.error = null
      state.loading = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateJobs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCandidateJobs.fulfilled, (state, action) => {
        state.loading = false
        state.jobs = action.payload
      })
      .addCase(fetchCandidateJobs.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch candidate jobs'
      })
      // Employer jobs
      .addCase(fetchEmployerJobs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEmployerJobs.fulfilled, (state, action) => {
        state.loading = false
        state.jobs = action.payload
      })
      .addCase(fetchEmployerJobs.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch employer jobs'
      })
  }
})

export const { clearJobs } = jobsSlice.actions
export default jobsSlice.reducer
