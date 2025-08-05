import axiosInstance from './axiosInstance';

export const postJob = async (job: {
  title: string;
  description: string;
  location: string;
  skills: string[];
  compensation: string;
  companyName: string;
  companyLogo: string;
  companyWebsite: string;
}) => {
  try {
    const response = await axiosInstance.post('/job/create', job);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to post job');
  }
};

export const getApplicants = async (jobId: string) => {
  try {
    console.log(jobId)
    const response = await axiosInstance.get(`/applications/${jobId}/associated-applications`);
    return response.data.applications;
  } catch (error) {
    console.error(error);
    console.log('api failed');
    throw new Error('Failed to fetch applicants');
  }
};

export const getPostedJobs = async () => {
  try {
    const response = await axiosInstance.get('/job/posted-jobs');
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch applicants');
  }
}

export const updateApplicationStatus = async (applicationId: string, statusObj: { status: string }) => {
  try {
    const res = await axiosInstance.patch(`/applications/update-application-status/${applicationId}`, statusObj);
    return res.data
  } catch (err) {
    console.error(err);
    throw new Error('Failed to update application status');

  }
}

export const closeJob = async (jobId: string) => {
  try {
    const res = await axiosInstance.patch(`/job/close-job/${jobId}`);
    return res.data;
  } catch (err) {
    console.error("closeJob API failed", err);
    throw err;
  }
}

export const deleteJob = async (jobId: string) => {
  try {
    const res = await axiosInstance.delete(`job/delete-job/${jobId}`);
    return res.data;
  } catch (err) {
    console.error("Deletejob API failed", err);
    throw err;
  }
}