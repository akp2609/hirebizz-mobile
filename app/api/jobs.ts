import axiosInstance from './axiosInstance'
import { Job } from '../navigation/types'

export const fetchJobs = async (params = {}): Promise<Job[]> => {
  const res = await axiosInstance.get('/job/', { params })
  console.log('jobs:', res);
  return res.data.jobs
}

export const relevantJobsForUser = async () => {
  const res = await axiosInstance.get('user/relevant-jobs');
  return res.data.relevantJobs

}