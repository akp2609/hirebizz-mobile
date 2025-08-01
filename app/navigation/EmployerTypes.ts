export type EmployerStackParamList = {
  EmployerHome: undefined;
  Drawer:undefined;
  Chats:undefined;
  PostJob: undefined;
  ChatWithApplicant: { applicantId: string };
  Applicants: { jobId: string };
  ApplicantsScreen: { jobId: string };
  EmployerDrawer: undefined
  Splash:undefined;
  PostLoginLoading:undefined
  Chat: {
  chatId: string;
  participant: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
};

};
