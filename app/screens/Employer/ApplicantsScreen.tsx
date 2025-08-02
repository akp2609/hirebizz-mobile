import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { EmployerStackParamList } from '../../navigation/EmployerTypes';
import { getApplicants, updateApplicationStatus } from '../../api/employer';
import ApplicantCard from '../../components/employer/ApplicantCard';

type RouteProps = RouteProp<EmployerStackParamList, 'ApplicantsScreen'>;

interface ApplicantData{
  _id:string;
  name: string;
  email: string;
}

interface Applicant {
  applicant: ApplicantData
  coverLetter: string;
  _id: string;
  status: string
  onAccept: (applicationId: string)=>void
  onReject: (applicationId: string)=>void
}

const ApplicantsScreen = () => {
  const route = useRoute<RouteProps>();
  const { jobId } = route.params;

  const [applicants,setApplicants] = useState<Applicant[]>([]);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    const fetchApplicants = async()=>{
    setLoading(true);
    try{
        const applicantsOfThisJob = await getApplicants(jobId);
        setApplicants(applicantsOfThisJob);
    }catch(err){
        console.log('Error fetching applicants',err);
    }
    setLoading(false);
    }

    fetchApplicants();

  },[jobId])

  const handleOnAccept = async(applicationId: string)=>{
    
    try{
      const res = await updateApplicationStatus(applicationId,{status:'accepted'});
      setApplicants(prevApplicants=> prevApplicants.map(app => app._id === applicationId?{...app,status:'accepted'}: app))
    }catch(err){
      console.log('Failed to update the application status',err);
    }
  }

  const handleOnReject = async(applicationId: string)=>{
    
    try{
      const res = await updateApplicationStatus(applicationId,{status:'rejected'});
      setApplicants(prevApplicants=> prevApplicants.map(app => app._id === applicationId?{...app,status:'rejected'}: app))
    }catch(err){
      console.log('Failed to update the application status',err);
    }
  }

  return (
   <ScrollView>
    {applicants.length === 0 && !loading? 
    (<View>
        <Text>{loading? 'Loading Please wait':'No applicants yet'}</Text>
    </View>):
    (
    applicants.map((applicant)=>(
        <ApplicantCard
        key={applicant._id}
        name = {applicant.applicant.name}
        email={applicant.applicant.email}
        coverLetter={applicant.coverLetter}
        _id={applicant.applicant._id}
        status={applicant.status}
        onAccept={()=>handleOnAccept(applicant._id)}
        onReject={()=>handleOnReject(applicant._id)}/>
       ))
    )
    }
   </ScrollView>
  );
};

export default ApplicantsScreen;
