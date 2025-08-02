import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import { useAppSelector } from '../../store/hooks';
import { Ionicons } from '@expo/vector-icons';
import { Job } from '../../navigation/types';
import { Entypo } from '@expo/vector-icons'; 
import { useModal } from '../../context/ModalContext';
import ReportModal from './ReportModal';


const screenWidth = Dimensions.get('window').width;

interface JobCardProps {
  _id: string,
  title: string;
  company: string;
  location: string;
  compensation: number;
  description: string;
  skills: string[];
  isActive:boolean
  relevancy?: number;
  onApply?: () => void;
  onViewDetails?: () => void;
  onViewApplicants?: () => void;
  isSaved?: boolean
  onToggleSave?: (jobId: Job, isSaved: boolean) => void;
}

const JobCard: React.FC<JobCardProps> = ({
  _id,
  title,
  company,
  location,
  compensation,
  description,
  skills,
  isActive,
  onViewDetails,
  onViewApplicants,
  relevancy,
  isSaved,
  onToggleSave
}) => {

  const user = useAppSelector((state) => state.user.user);
  const {handleMenuPress, reportModalVisible,closeReportModal,openReportModal,handleSubmitReport} = useModal()
  const [dropdownVisible, setDropdownVisible] = useState(false);


  return (
    <View style={styles.card}>
      <View style={styles.topSection}>
      <Text style={styles.title}>
          {title.length > 20 ? title.slice(0, 17) + '...' : title}
      </Text>
        
        {user?.role !== 'employer' && (
        <TouchableOpacity
          style={{ position: 'absolute', top: 8, right: 16 }}
         onPress={() => onToggleSave && onToggleSave({ 
        _id, title, company: { name: company }, location, compensation, isActive,description, skills, relevancy 
        }, !!isSaved)}
        >
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isSaved ? '#4B9EFF' : '#ccc'}
          />
        </TouchableOpacity>
      )}
      <View style={{ position: 'absolute', top: 8, right: 0, flexDirection: 'row', alignItems: 'center' }}>
  {user?.role === 'employer' && (
    <View style={[styles.statusBadge,isActive ? styles.active : styles.closed]}>
      <Text style={styles.statusText}>{isActive ? 'Active' : 'Closed'}</Text>
    </View>
  )}
  <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
    <Entypo name="dots-three-vertical" size={20} color="#333" style={{ marginLeft: 8 }} />
  </TouchableOpacity>
</View>


      {dropdownVisible && !reportModalVisible && user?.role !== 'employer' && (
    <View style={styles.dropdown}>
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        setDropdownVisible(false);
        openReportModal({
          _id, title, company: { name: company }, location, compensation, description, skills,isActive, relevancy
        });
      }}
    >
      <Ionicons name="alert-circle-outline" size={18} color="#4B9EFF" style={{ marginRight: 6 }} />
      <Text style={styles.dropdownText}>Report Job?</Text>
     </TouchableOpacity>
    </View>
    )}

    {dropdownVisible && user?.role === 'employer' && (
  <View style={styles.dropdown}>
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        handleMenuPress({
          _id, title, company: { name: company }, location, compensation, description, skills,isActive, relevancy
        }, 'delete');
        setDropdownVisible(false);
      }}
    >
      <Ionicons name="trash-outline" size={18} color="red" style={{ marginRight: 6 }} />
      <Text style={[styles.dropdownText, { color: 'red' }]}>Delete Job</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        handleMenuPress({
          _id, title, company: { name: company }, location, compensation, description, skills,isActive,relevancy
        }, 'close');
        setDropdownVisible(false);
      }}
    >
      <Ionicons name="close-circle-outline" size={18} color="#4B9EFF" style={{ marginRight: 6 }} />
      <Text style={styles.dropdownText}>Close Job</Text>
    </TouchableOpacity>
  </View>
)}



        <Text style={styles.company}>🏢 {company}</Text>
        <Text style={styles.details}>📍 {location}</Text>
        <Text style={styles.details}>💰 ₹{compensation}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>

        <ScrollView
          style={styles.skillsScroll}
          contentContainerStyle={styles.skillsContainer}
          showsVerticalScrollIndicator={false}
        >
          {skills.map((skill, index) => (
            <Text key={index} style={styles.skill}>
              {skill}
            </Text>
          ))}
        </ScrollView>

        {typeof relevancy === 'number' && (
          <View style={styles.relevancyContainer}>
            <Progress.Bar
              progress={relevancy}
              width={150}
              color="#4caf50"
              unfilledColor="#e0e0e0"
              borderWidth={0}
              height={10}
            />
            <Text style={styles.relevancyText}>
              {(relevancy ).toFixed(2)}%
            </Text>
          </View>
        )}
        
      </View>

      <View style={styles.buttonSection}>
        {onViewDetails && <TouchableOpacity style={styles.button} onPress={onViewDetails}>
         <Text style={styles.text}>View Details</Text>
      </TouchableOpacity>}
        {onViewApplicants && <TouchableOpacity style={styles.button} onPress={onViewApplicants}>
          <Text style={styles.text}>View Applicants</Text>
        </TouchableOpacity> }
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginBottom: 15,
    marginRight: 15,
    width: screenWidth * 0.85,
    flexShrink: 0,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  topSection: {
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 16,
    marginTop: 4,
  },
  details: {
    fontSize: 14,
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    marginTop: 6,
  },
  skillsScroll: {
    maxHeight: 80, 
    marginTop: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skill: {
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 14,
  },
  relevancyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  relevancyText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#333',
  },
  buttonSection: {
    marginTop: 10,
    elevation:6
  },
  dropdown: {
  position: 'absolute',
  top: 36,
  right: 0,
  backgroundColor: '#fff',
  borderRadius: 12,
  paddingVertical: 6,
  paddingHorizontal: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 4,
  zIndex: 999,
},
dropdownItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 8,
},
dropdownText: {
  color: '#4B9EFF',
  fontSize: 14,
  fontWeight: '500',
},
statusBadge: {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 10,
},
statusText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: '600',
},
active: {
  backgroundColor: '#4caf50',
},
closed: {
  backgroundColor: '#fa052e',
},
button: {
    backgroundColor: '#4B9EFF', // iPhone blue
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, 
  },
  text: {
    color: '#FFFFFF', 
    fontSize: 16,
    fontWeight: '600',
  },

});

export default JobCard;
