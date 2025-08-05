import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmployerDrawer from '../../navigation/EmployerNavigator';
import ApplicantsScreen from './ApplicantsScreen';
import { EmployerStackParamList } from '../../navigation/EmployerTypes';

const Stack = createNativeStackNavigator<EmployerStackParamList>();

const EmployerStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="EmployerDrawer" component={EmployerDrawer} />
    <Stack.Screen name="ApplicantsScreen" component={ApplicantsScreen} options={{ headerShown: true, title: 'Applicants' }} />
  </Stack.Navigator>
);

export default EmployerStackNavigator;
