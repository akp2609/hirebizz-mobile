import axiosInstance from './axiosInstance'

export const applyToJob = async (
  jobId: string,
  coverLetter: string
) => {
  const res = await axiosInstance.post(
    `/applications/apply/${jobId}`,
    { coverLetter },
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
  return res.data
}

export const fetchMyApplications = async () => {
  const res = await axiosInstance.get('/applications/my-applications')
  console.log(res.data)
  return res.data
}


export const getRefreshedSignedURLApplications = async(applicationId: string)=>{
  const res = await axiosInstance.get(`/applications/${applicationId}/refresh-resume-url`);
  return res.data.url
}

export const withdrawApplication = async(applicationId:string)=>{
  const res = await axiosInstance.delete(`/applications/withdraw-application/${applicationId}`);
  return res.data
}