import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { postJob } from '../../api/employer';
import { Feather } from '@expo/vector-icons';

const PostJobScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [compensation, setCompensation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');

  const handleSubmit = async () => {
    try {
      const jobData = {
        title,
        description,
        location,
        skills: skills.split(','),
        compensation,
        companyName,
        companyLogo,
        companyWebsite,
      };

      await postJob(jobData);
      Alert.alert('Success', 'Job posted successfully');

      setTitle('');
      setDescription('');
      setLocation('');
      setSkills('');
      setCompensation('');
      setCompanyName('');
      setCompanyLogo('');
      setCompanyWebsite('');
    } catch (error) {
      Alert.alert('Error', 'Failed to post job');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📝 Post a New Job</Text>

      <TextInput
        style={styles.input}
        placeholder="📌 Job Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#999"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="🗒️ Description"
        value={description}
        onChangeText={setDescription}
        multiline
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="📍 Location"
        value={location}
        onChangeText={setLocation}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="🛠️ Skills (comma separated)"
        value={skills}
        onChangeText={setSkills}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="💰 Compensation"
        value={compensation}
        onChangeText={setCompensation}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="🏢 Company Name"
        value={companyName}
        onChangeText={setCompanyName}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="🖼️ Company Logo URL"
        value={companyLogo}
        onChangeText={setCompanyLogo}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="🌐 Company Website"
        value={companyWebsite}
        onChangeText={setCompanyWebsite}
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Post Job</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PostJobScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4B9EFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 14,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4B9EFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4B9EFF',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
