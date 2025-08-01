import axiosInstance from './axiosInstance'

export const uploadResume = async (resume: {
  uri: string
  name: string
  type: string
}) => {
  const formData = new FormData()

  formData.append('resume', {
    uri: resume.uri,
    name: resume.name,
    type: resume.type
  } as any)

  const res = await axiosInstance.post('/user/upload-resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return res.data
}


export const uploadProfilePic = async (image: {
  uri: string
  name: string
  type: string
}) => {
  const formData = new FormData()
  formData.append('profilePic', {
    uri: image.uri,
    name: image.name,
    type: image.type,
  } as any)

  const res = await axiosInstance.post('/user/upload-profile-pic', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return res.data
}

export const getUserProfile = async()=>{
  const res = await axiosInstance.get('/user/get-profile')
  return res.data.user;
}

export const refreshUserResumeURL = async()=>{
  const res = await axiosInstance.get('/user/refresh-resume-url')
  return res.data.resumeURL;
}

export const userRelevantJobs = async()=>{
  const res = await axiosInstance.get('/user/relevant-jobs');
  return res.data.relevantJobs
}

export const getSavedJobs = async()=>{
  const res = await axiosInstance.get('/user/saved-jobs');
  return res.data.savedJobs;
}

export const postSavedJob = async(jobId:string)=>{
  const res = await axiosInstance.post(`/user/${jobId}/save-Job`)
  return res.data;
}

export const deleteSavedJobs = async(jobId:string)=>{
  const res = await axiosInstance.delete(`/user/saved-Jobs/${jobId}`)
  return res.data
}