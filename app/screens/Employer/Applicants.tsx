import { ScrollView, Text } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import JobCard from '../../components/common/JobCard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EmployerStackParamList } from '../../navigation/EmployerTypes';

type NavigationProp = StackNavigationProp<EmployerStackParamList, 'ApplicantsScreen'>;

const Applicants = () => {
  const dispatch = useAppDispatch();
  const { jobs, loading } = useAppSelector((state) => state.jobs);
  const navigation = useNavigation<NavigationProp>();

  const openApplicantsPage = (jobId: string) => {
    console.log('Navigating to ApplicantsScreen with jobId:', jobId);
    navigation.navigate('ApplicantsScreen', { jobId });;

  };

  return (
    <ScrollView style={{ margin: 10 }}>
      {jobs.length === 0 && !loading ? (
        <Text>No jobs posted yet.</Text>
      ) : (
        jobs.filter((job) => job.isActive === true || job.isActive === false).sort(
          (a, b) => {
            return Number(b.isActive) - Number(a.isActive)
          }
        ).map((job) => (
          <JobCard
            _id={job._id}
            key={job._id}
            title={job.title}
            company={job.company?.name || 'Unknown'}
            location={job.location}
            compensation={job.compensation}
            isActive={job.isActive}
            description={job.description}
            skills={job.skills}
            onViewApplicants={() => openApplicantsPage(job._id)}
          />
        ))
      )}
    </ScrollView>
  );
};

export default Applicants;
