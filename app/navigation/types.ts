import { NavigatorScreenParams } from '@react-navigation/native';
import { EmployerStackParamList } from './EmployerTypes';

export type RootStackParamList = {
  Splash:undefined;
  PostLoginLoading:undefined;
  Login: undefined;
  Register: undefined;
  Drawer: undefined;
  Reset:undefined
  Chat: {
    chatId: string;
    participant: {
      _id: string;
      name: string;
      email: string;
      profilePicture?: string;
    };
  };
  Employer: undefined;
  PostJob: undefined;
  Home: undefined;
  ChatListSceen:undefined;
  Chats:undefined;
  ApplicantsScreen: { jobId: string };
  Main: NavigatorScreenParams<EmployerStackParamList>; 
};

export interface Job {
  _id: string;
  title: string;
  company?: {
    name: string;
  };
  location: string;
  compensation: number;
  description: string;
  skills: string[];
  relevancy?: number
  isActive:boolean
}


export interface Report {
  targetType: string;
  targetId: string;
  reason: string;
  details: string
}


export interface Applicant{
  _id: string,
  type: string
}