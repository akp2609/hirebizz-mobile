import React, { FC } from 'react'
import { View, Text, Modal, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useAppSelector } from '../../store/hooks'
import { Job } from '../../navigation/types'
import { Feather } from '@expo/vector-icons'

interface JobDetailsProps {
  visible: boolean
  onClose: () => void
  job: Job
  onApply: () => void
}

const ViewJobDetails: FC<JobDetailsProps> = ({ visible, onClose, onApply, job }) => {
  const user = useAppSelector((state) => state.user.user)

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.card}>
          {/* Fixed Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Feather name="arrow-left" size={20} color="#4B9EFF" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{job.title}</Text>

            <View style={styles.detailItem}>
              <Feather name="briefcase" size={16} color="#333" />
              <Text style={styles.detailText}>{job.company?.name}</Text>
            </View>

            <View style={styles.detailItem}>
              <Feather name="map-pin" size={16} color="#333" />
              <Text style={styles.detailText}>{job.location}</Text>
            </View>

            <View style={styles.detailItem}>
              <Feather name="dollar-sign" size={16} color="#333" />
              <Text style={styles.detailText}>{job.compensation}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.subTitle}>📝 Description</Text>
              <Text style={styles.description}>{job.description}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.subTitle}>🔧 Skills</Text>
              <Text style={styles.description}>{job.skills?.join(', ') || 'No skills listed'}</Text>
            </View>

            {user && user.role !== 'employer' && (
              <TouchableOpacity style={styles.applyButton} onPress={onApply}>
                <Text style={styles.applyButtonText}>Apply Now</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default ViewJobDetails


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center', 
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%', 
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
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#4B9EFF',
    fontSize: 16,
    marginLeft: 6,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4B9EFF',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginTop: 16,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 20,
  },
  applyButton: {
    marginTop: 24,
    backgroundColor: '#4B9EFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
