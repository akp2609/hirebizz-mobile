import { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native"
import JobCard from "../../components/common/JobCard";
import { useModal } from "../../context/ModalContext";
import ApplyModal from "../../components/candidate/ApplyModal";
import ViewJobDetails from "../../components/common/ViewDetailsModal";


const Bookmarks = () => {
  const [loading, setLoading] = useState(false)
  const {
    openApplyModal,
    openJobDetailsModal,
    selectedJob,
    applyModalVisible,
    detailsModalVisible,
    closeApplyModal,
    closeJobDetailsModal,
    onSubmit,
    toggleSaveJob,
    savedJobs
  } = useModal();

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#FFF' }}>

      {loading ? (
        <ActivityIndicator size="large" />) : (

        savedJobs.map((job) => (
          <View key={job._id}>
            <JobCard
              _id={job._id}
              title={job.title}
              company={job.company?.name || 'Unknown'}
              location={job.location}
              compensation={job.compensation}
              description={job.description}
              skills={job.skills}
              isActive={job.isActive}
              onViewDetails={() => openJobDetailsModal(job)}
              onApply={() => openApplyModal(job)}
              isSaved={savedJobs.some((j) => j._id === job._id)}
              onToggleSave={(job, isSaved) => toggleSaveJob(job, isSaved)}
            />

            {selectedJob && selectedJob.company && (
              <ApplyModal
                visible={applyModalVisible}
                onClose={closeApplyModal}
                jobId={selectedJob._id}
                onSubmit={onSubmit}
              />

            )}

            {selectedJob && selectedJob.company && (
              <ViewJobDetails
                visible={detailsModalVisible}
                onClose={closeJobDetailsModal}
                job={selectedJob}
                onApply={() => {
                  closeJobDetailsModal();
                  if (selectedJob) {
                    openApplyModal(selectedJob);
                  }
                }}
              />
            )}
          </View>
        )))}
    </ScrollView>


  )
}

export default Bookmarks;