import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  AppState,
  Modal,
  StyleSheet
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Ionicons } from '@expo/vector-icons';
import JobCard from '../components/common/JobCard';
import ViewJobDetails from '../components/common/ViewDetailsModal';
import ApplyModal from '../components/candidate/ApplyModal';
import { fetchCandidateJobs, fetchEmployerJobs } from '../features/jobs/jobSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import UploadResume from './Candidate/UploadResume';
import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash.debounce';
import { fetchJobs } from '../api/jobs';
import { TextInput } from 'react-native-gesture-handler';
import { Job } from '../navigation/types';
import RelevantJobs from '../components/candidate/RelevantJobs';
import { useModal } from '../context/ModalContext';
import { Feather } from '@expo/vector-icons'
import ReportModal from '../components/common/ReportModal';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const RESUME_POPUP_KEY = 'resume_popup_last_shown';
const RESUME_POPUP_SUPPRESS_KEY = 'resume_popup_suppress';

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const user = useAppSelector((state) => state.user.user);
  const { jobs, loading, error } = useAppSelector((state) => state.jobs);
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    skills: '',
    isActive: true,
    sortBy: 'latest',
    minComp: '',
    maxComp: '',
  });


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Chats')} style={{ marginRight: 6 }}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);


  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      if (user.role === 'employer') {
        dispatch(fetchEmployerJobs());
      } else {
        dispatch(fetchCandidateJobs());
      }
    }, [user, dispatch])
  )

  const {
    applyModalVisible,
    openApplyModal,
    closeApplyModal,
    detailsModalVisible,
    openJobDetailsModal,
    closeJobDetailsModal,
    selectedJob,
    onSubmit,
    savedJobs,
    toggleSaveJob,
    reportModalVisible,
    closeReportModal,
    handleSubmitReport,
    reportTarget,
  } = useModal();

  const handleResumeRemainder = async () => {
    if (!user || user.resumeURL) return;

    const suppress = await AsyncStorage.getItem(RESUME_POPUP_SUPPRESS_KEY);
    if (suppress === 'true') return;

    const lastShown = await AsyncStorage.getItem(RESUME_POPUP_KEY);
    const now = Date.now();

    if (!lastShown || now - parseInt(lastShown) > 24 * 60 * 60 * 1000) {
      setShowResumePopup(true);
      await AsyncStorage.setItem(RESUME_POPUP_KEY, now.toString());
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        await handleResumeRemainder();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (query, filters) => {
      try {
        const cleanedFilters = {
          ...filters,
          isActive: filters.isActive.toString(),
          location: filters.location.trim(),
        };

        Object.keys(cleanedFilters).forEach((key) => {
          if (cleanedFilters[key] === '') {
            delete cleanedFilters[key];
          }
        });
        console.log('Searching with:', query, filters);
        const jobs = await fetchJobs({
          search: query,
          ...cleanedFilters
        });
        setFilteredJobs(jobs);
      } catch (err) {
        console.error('Search failed', err);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (user && (user.role === 'candidate' || user.role === 'admin' || user.role === 'superadmin')) {
      debouncedSearch(searchQuery, filters);
    }
  }, [searchQuery, filters, user]);


  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Not logged in</Text>
      </View>
    );
  }

  if (user.role !== 'employer') {
    jobs.filter((job) => job.isActive)
  }

  const isFiltering = searchQuery || filters.location || filters.skills || filters.minComp || filters.maxComp;

  const jobsToDisplay = isFiltering ? filteredJobs : jobs;


  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#FFF' }}>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TextInput
          placeholder="Search jobs..."
          placeholderTextColor={'#000'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ccc',
            outlineColor: '#b8b7b6',
            padding: 10,
            borderRadius: 8,
          }}
        />
        <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={{ marginLeft: 10 }}>
          <Ionicons name="filter" size={24} color="#b8b7b6" />
        </TouchableOpacity>
      </View>

      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <ScrollView style={{ marginTop: 10 }}>

        {user.role !== 'employer' && user.objectName && user.isPremiumUser? (
          <View style={{ marginTop: 20 }}>
            <RelevantJobs
              onViewDetails={(job) => openJobDetailsModal(job)}
              onApply={(job) => {
                closeJobDetailsModal();
                openApplyModal(job);
              }}
              savedJobs={savedJobs}
              onToggleSave={(job, isSaved) => toggleSaveJob(job, isSaved)}
            />
          </View>
        ) : (
          <></>
        )}
        <Text style={{ fontSize: 18, fontWeight: "bold", color: '#929292', marginTop: 5, marginBottom: 4 }}>All Posted Jobs</Text>

        {isFiltering ? (
          jobsToDisplay.length === 0 ? (
            <Text>No jobs match your filters.</Text>
          ) : (
            filteredJobs
              .filter((job) => {
                return user.role === 'employer' || job.isActive;
              }).sort((a, b) => {
                if (user.role === 'employer') {
                  return Number(b.isActive) - Number(a.isActive);
                }
                return 0;
              })
              .map((job) => (
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
                </View>
              ))
          )
        ) : (
          jobs
            .filter((job) => {
              return user.role === 'employer' || job.isActive;
            }).sort((a, b) => {
              if (user.role === 'employer') {
                return Number(b.isActive) - Number(a.isActive);
              }
              return 0;
            })
            .map((job) => (
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

              </View>
            ))
        )}

      </ScrollView>

      <ReportModal
        visible={reportModalVisible}
        onClose={closeReportModal}
        onSubmit={(reason, details) => {
          if (!reportTarget) return;

          const isApplicant = "name" in reportTarget && "email" in reportTarget;

          const reportPayload = {
            targetId: reportTarget._id,
            targetType: isApplicant ? "user" : "job",
            reason,
            details,
          };

          handleSubmitReport(reportPayload);
          closeReportModal();
        }}
      />

      <Modal visible={filterModalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => setFilterModalVisible(false)}>
              <Feather name="x" size={24} color="#4B9EFF" />
            </TouchableOpacity>

            <Text style={styles.title}>🔍 Filter Jobs</Text>

            <TextInput
              placeholder="📍 Location"
              placeholderTextColor={'#000'}
              value={filters.location}
              onChangeText={(text) => setFilters((prev) => ({ ...prev, location: text }))}
              style={styles.input}
            />

            <TextInput
              placeholder="💼 Skills (comma separated)"
              value={filters.skills}
              placeholderTextColor={'#000'}
              onChangeText={(text) => setFilters((prev) => ({ ...prev, skills: text }))}
              style={styles.input}
            />

            <TextInput
              placeholder="💰 Min Compensation"
              value={filters.minComp}
              placeholderTextColor={'#000'}
              onChangeText={(text) => setFilters((prev) => ({ ...prev, minComp: text }))}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              placeholder="💸 Max Compensation"
              value={filters.maxComp}
              onChangeText={(text) => setFilters((prev) => ({ ...prev, maxComp: text }))}
              keyboardType="numeric"
              placeholderTextColor={'#000'}
              style={styles.input}
            />

            <TouchableOpacity style={styles.applyButton} onPress={() => {
              setFilterModalVisible(false)
              debouncedSearch(searchQuery, filters)
            }}>
              <Text style={styles.buttonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
          job={selectedJob || {}}
          onApply={() => {
            closeJobDetailsModal();
            openApplyModal(selectedJob);
          }}
        />
      )}

      <Modal visible={showResumePopup} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              width: '80%',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Upload Your Resume</Text>
            <Text style={{ marginBottom: 10 }}>
              Upload your resume to see more relevant jobs tailored for

            </Text>

            <UploadResume resumeExists={false} />

            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => setShowResumePopup(false)}
            >
              <Text style={{ color: 'blue' }}>Maybe Later</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={async () => {
                await AsyncStorage.setItem(RESUME_POPUP_SUPPRESS_KEY, 'true');
                setShowResumePopup(false);
              }}
            >
              <Text style={{ color: 'gray' }}>Don't show again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>


  );
};

export default HomeScreen;


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4B9EFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  applyButton: {
    backgroundColor: '#4B9EFF',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
