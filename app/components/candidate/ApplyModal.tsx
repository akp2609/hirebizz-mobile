import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import UploadResume from '../../screens/Candidate/UploadResume';
import { useAppSelector } from '../../store/hooks';
import { refreshUserResumeURL } from '../../api/user';

type Props = {
  visible: boolean;
  onClose: () => void;
  jobId: string;
  onSubmit: (jobId: string, coverLetter: string) => void;
};

const ApplyModal = ({ visible, onClose, jobId, onSubmit }: Props) => {
  const user = useAppSelector((state) => state.user.user);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeExists, setResumeExists] = useState(!!user?.objectName);
  const [resumeURL, setResumeURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!coverLetter.trim()) {
      alert('Cover letter is required.');
      return;
    }

    onSubmit(jobId, coverLetter.trim());
  };

  useEffect(() => {
    const fetchResumeURL = async () => {
      setLoading(true);
      try {
        const res = await refreshUserResumeURL();
        setResumeURL(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeURL();
  }, []);

  const handleOpenResume = async () => {
    if (!resumeExists) {
      alert('Please upload a resume first.');
      return;
    }

    if (!resumeURL) {
      alert('Resume URL is not available yet.');
      return;
    }

    try {
      const supported = await Linking.canOpenURL(resumeURL);
      if (supported) {
        await Linking.openURL(resumeURL);
      } else {
        alert('Invalid resume link.');
      }
    } catch (err) {
      console.error('Failed to open resume', err);
      alert('Something went wrong.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.scroll}>

            <View style={styles.header}>
              <Text style={styles.title}>Apply to Job</Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={24} color="#4B9EFF" />
              </TouchableOpacity>
            </View>


            {!resumeExists && (
              <Text style={styles.notice}>
                ⚠️ Please upload a resume to proceed with the application
              </Text>
            )}

            
            <Text style={styles.label}>Cover Letter</Text>
            <TextInput
              multiline
              style={styles.input}
              placeholder="Write a short cover letter..."
              placeholderTextColor="#aaa"
              value={coverLetter}
              onChangeText={setCoverLetter}
              textAlignVertical="top"
            />

            
            {resumeExists && (
              <TouchableOpacity onPress={handleOpenResume}>
                <Text style={styles.resumeLink}>📄 View Current Resume</Text>
              </TouchableOpacity>
            )}


            <UploadResume resumeExists={resumeExists} />


            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Submit Application</Text>
              )}
            </TouchableOpacity>


            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ApplyModal;


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    maxHeight: '90%',
  },
  scroll: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4B9EFF',
  },
  notice: {
    color: '#ff3b30',
    marginBottom: 10,
    fontSize: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    fontSize: 15,
    color: '#333',
  },
  resumeLink: {
    color: '#4B9EFF',
    marginVertical: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4B9EFF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  cancelText: {
    color: '#999',
    fontSize: 15,
  },
});
