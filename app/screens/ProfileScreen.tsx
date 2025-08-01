import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { uploadProfilePic, uploadResume, refreshUserResumeURL } from '../api/user';
import { loginSuccess } from '../features/user/userSlice';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [uploading, setUploading] = useState(false);
  const [resumeURL, setResumeURL] = useState(user?.resumeURL || null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation()

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await refreshUserResumeURL();
        setResumeURL(res);
      } catch (err) {
        console.error('Resume fetch failed');
      }
    };
    fetchResume();
  }, [user]);

  const pickImage = async () => {

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access images is required!');
    return;
  }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      try {
        setUploading(true);
        const data = await uploadProfilePic({
          uri: image.uri,
          name: image.fileName || 'profile.jpg',
          type: image.type || 'image/jpeg',
        });
        Alert.alert('Success', 'Profile picture updated!');
        if (data.user) dispatch(loginSuccess(data.user));
      } catch (err) {
        Alert.alert('Error', 'Upload failed');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleResume = async () => {
    if (!resumeURL) {
      Alert.alert('Resume URL not available', 'Please wait while we fetch your resume.');
      return;
    }
    if (user?.objectName) {
      const supported = await Linking.canOpenURL(resumeURL);
      if (supported) await Linking.openURL(resumeURL);
      else Alert.alert('Error', 'Invalid resume URL');
    } else {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const doc = result.assets[0];
        try {
          setUploading(true);
          const data = await uploadResume({
            uri: doc.uri,
            name: doc.file?.name || 'resume.pdf',
            type: doc.mimeType || 'application/pdf',
          });
          Alert.alert('Success', 'Resume uploaded');
          if (data.user) dispatch(loginSuccess(data.user));
        } catch (err) {
          Alert.alert('Error', 'Upload failed');
        } finally {
          setUploading(false);
        }
      }
    }
  };

  const calculateCompleteness = () => {
    let score = 0;
    if (user?.profilePicture) score += 1;
    if (user?.bio) score += 1;
    if (user?.location) score += 1;
    if (user?.resumeURL) score += 1;
    if (user?.isEmailVerified) score += 1;
    return (score / 5) * 100;
  };

  const completeness = calculateCompleteness();
  const isComplete = completeness === 100;

  if (!user) return null;

  return (
    <LinearGradient colors={['#F8F9FA', '#F8F9FA']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scroll}>
        

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: user.profilePicture }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent>
          <View style={styles.modalOverlay}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeIcon}>
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
            <Image source={{ uri: user.profilePicture }} style={styles.fullImage} resizeMode="contain" />
          </View>
        </Modal>

        <View style={styles.card}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

          {user.isEmailVerified && (
            <Text style={styles.verified}>✅ Verified Email</Text>
          )}

          {user.isPremiumUser && (
            <Text style={styles.premium}>🌟 Premium Member</Text>
          )}

          {user.location && (
            <Text style={styles.detail}>📍 {user.location}</Text>
          )}

          {user.bio && (
            <Text style={styles.detail}>📝 {user.bio}</Text>
          )}

          <Text style={styles.detail}>🎯 Role: {user.role}</Text>
          {user.role!=='employer' && <Text style={styles.detail}>📄 Applied Jobs: {user.appliedJobs?.length || 0}</Text>}

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${completeness}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Profile {Math.round(completeness)}% Complete
          </Text>


          {user.role === 'employer' && user.company?.name && (
            <View style={styles.companyCard}>
              <Image
                source={{ uri: user.company.logo }}
                style={styles.companyLogo}
              />
              <View>
                <Text style={styles.companyName}>{user.company.name}</Text>
                <Text style={styles.companyWebsite}>{user.company.website}</Text>
              </View>
            </View>
          )}

          <TouchableOpacity onPress={pickImage} disabled={uploading}>
            <Text style={styles.action}>
              {uploading ? 'Uploading...' : 'Change Profile Picture'}
            </Text>
          </TouchableOpacity>

          {user.role !== 'employer' && 
          <TouchableOpacity onPress={handleResume}>
            <Text style={styles.action}>
              {user.objectName ? 'View Resume' : 'Upload Resume'}
            </Text>
          </TouchableOpacity>
          }
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scroll: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  lottie: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#4B9EFF',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#4B9EFF',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4B9EFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
  },
  verified: {
    fontSize: 14,
    color: '#2ecc71',
    marginBottom: 4,
  },
  premium: {
    fontSize: 14,
    color: '#f1c40f',
    marginBottom: 4,
  },
  detail: {
    fontSize: 15,
    color: '#555',
    marginBottom: 6,
  },
  action: {
    fontSize: 16,
    color: '#4B9EFF',
    marginTop: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
    progressContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 12,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4B9EFF',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#4B9EFF',
    fontWeight: '500',
    marginBottom: 12,
  },
  companyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#4B9EFF',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#dfe6e9',
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B9EFF',
  },
  companyWebsite: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  fullImage: {
    width: '90%',
    height: '70%',
    borderRadius: 12,
  },
  closeIcon: {
  position: 'absolute',
  top: 40,
  right: 20,
  backgroundColor: '#4B9EFF',
  padding: 8,
  borderRadius: 20,
  zIndex: 10,
  elevation: 5,
},
});