import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Applicant, Job } from "../navigation/types";
import { applyToJob } from "../api/application";
import { deleteSavedJobs, getSavedJobs, postSavedJob } from "../api/user";
import { useAppSelector } from "../store/hooks";
import { closeJob, deleteJob } from "../api/employer";
import { postReport } from "../api/report";
import { Report } from "../navigation/types";
import { sendMessage } from "../api/chat";


interface ModalProviderProps {
  children: ReactNode;
}

interface ModalContextType {
  openApplyModal: (job: Job) => void;
  openJobDetailsModal: (job: Job) => void;
  selectedJob: Job | null;
  applyModalVisible: boolean;
  detailsModalVisible: boolean;
  closeApplyModal: () => void;
  closeJobDetailsModal: () => void;
  onSubmit: (jobId: string, coverLetter: string) => Promise<void>;
  toggleSaveJob: (job: Job, isSaved: boolean) => Promise<void>;
  savedJobs: Job[];
  handleMenuPress: (job: Job, action?: string) => void;
  handleMenuPressApplication: (applicant: any) => void
  reportModalVisible: boolean;
  reportTarget: Job | Applicant | null;
  openReportModal: (job: Job) => void;
  openReportModalEmployer: (applicant: Applicant) => void
  closeReportModal: () => void;
  closeReportModalEmployer: () => void;
  handleSubmitReport: (reportDetails: Report) => Promise<void>
  isMesaageModalVisible: boolean
  openMessageModal: () => void;
  closeMessageModal: () => void;
  handleSendMessage: (senderId: string, receiverId: string, message: any) => Promise<void>;
}

const ModalContext = createContext<ModalContextType>({
  openApplyModal: () => { },
  openJobDetailsModal: () => { },
  selectedJob: null,
  applyModalVisible: false,
  detailsModalVisible: false,
  closeApplyModal: () => { },
  closeJobDetailsModal: () => { },
  onSubmit: async () => { },
  toggleSaveJob: async () => { },
  savedJobs: [],
  handleMenuPress: (job: Job, action?: string) => { },
  handleMenuPressApplication: (applicant: any) => { },
  reportModalVisible: false,
  reportTarget: null,
  openReportModal: () => { },
  openReportModalEmployer: () => { },
  closeReportModalEmployer: () => { },
  closeReportModal: () => { },
  handleSubmitReport: async () => { },
  isMesaageModalVisible: false,
  openMessageModal: () => { },
  closeMessageModal: () => { },
  handleSendMessage: async () => { }
});


export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportTarget, setReportTarget] = useState<Job | Applicant | null>(null);
  const [isMesaageModalVisible, setMessageModleVisible] = useState(false)
  const user = useAppSelector((store) => store.user.user)

  const openApplyModal = (job: Job) => {
    setSelectedJob(job);
    setApplyModalVisible(true);
  };

  const openJobDetailsModal = (job: Job) => {
    setSelectedJob(job);
    setDetailsModalVisible(true);
  };

  const closeApplyModal = () => {
    setApplyModalVisible(false);
    setSelectedJob(null);
  };

  const closeJobDetailsModal = () => {
    setDetailsModalVisible(false);
    setSelectedJob(null);
  };

  const onSubmit = async (jobId: string, coverLetter: string) => {
    try {
      await applyToJob(jobId, coverLetter);
      alert('Application submitted successfully!');
      closeApplyModal();
    } catch (error: any) {
      console.error('Application error:', error);
      const message = error?.response?.data?.message || 'Failed to apply. Please try again.';
      alert(message);
    }
  };

  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  const toggleSaveJob = async (job: Job, isSaved: boolean) => {
    try {
      if (isSaved) {
        await deleteSavedJobs(job._id);
        setSavedJobs((prev) => prev.filter((j) => j._id !== job._id));
      } else {
        await postSavedJob(job._id);
        setSavedJobs((prev) => [...prev, job]);
      }
    } catch (error) {
      console.error('Toggle save failed', error);
    }
  };

  useEffect(() => {

    const fetchSavedJobs = async () => {
      if (!user || !user.token) return;
      try {
        const data = await getSavedJobs();
        setSavedJobs(data);
      } catch (err) {
        console.error('Error fetching saved jobs', err);
      }
    };

    fetchSavedJobs();
  }, [user]);

  const openReportModal = (job: Job) => {
    setReportTarget(job);
    setReportModalVisible(true);
  };

  const closeReportModal = () => {
    setReportTarget(null);
    setReportModalVisible(false);
  };

  const openReportModalEmployer = (applicant: Applicant) => {
    setReportTarget(applicant)
    setReportModalVisible(true)
  }

  const closeReportModalEmployer = () => {
    setReportTarget(null)
    setReportModalVisible(false)
  }

  const handleMenuPress = async (job: Job, action?: string) => {
    if (user?.role === 'employer' && action) {
      try {
        if (action === 'delete') {
          await deleteJob(job._id);
          alert('Job deleted successfully!');
        } else if (action === 'close') {
          await closeJob(job._id);
          alert('Job closed successfully!');
        }
      } catch (err) {
        alert(`Failed to ${action} job`);
        console.error(`${action} job failed:`, err);
      }
    } else {
      openReportModal(job);
    }
  };

  const handleMenuPressApplication = async (applicant: any) => {
    openReportModalEmployer(applicant)
  }

  const handleSubmitReport = async (reportDetails: Report) => {
    try {
      const res = await postReport(reportDetails)
      console.log(res)
      return res
    }
    catch (err) {
      console.log("Failed to post report", err);
    }
  }

  const openMessageModal = () => {
    setMessageModleVisible(true)
  }

  const closeMessageModal = () => {
    setMessageModleVisible(false)
  }

  const handleSendMessage = async (senderId: string, receiverId: string, message: any) => {
    try {
      const res = await sendMessage(senderId, receiverId, message);
      return res;
    }
    catch (err) {
      console.log("Failed to send message", err);
    }
  }
  return (
    <ModalContext.Provider
      value={{
        openApplyModal,
        openJobDetailsModal,
        selectedJob,
        applyModalVisible,
        detailsModalVisible,
        closeApplyModal,
        closeJobDetailsModal,
        onSubmit,
        toggleSaveJob,
        savedJobs,
        handleMenuPress,
        handleMenuPressApplication,
        reportModalVisible,
        reportTarget,
        openReportModal,
        openReportModalEmployer,
        closeReportModal,
        closeReportModalEmployer,
        handleSubmitReport,
        isMesaageModalVisible,
        openMessageModal,
        closeMessageModal,
        handleSendMessage
      }}
    >
      {children}

    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
