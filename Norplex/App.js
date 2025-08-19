import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import InstitutionLogin from './screens/InstitutionLogin';
//import TeacherLogin from './screens/TeacherLogin';
//import StudentLogin from './screens/StudentLogin';
//import ParentLogin from './screens/ParentLogin';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        
     
        <Stack.Screen name="InstitutionLogin" component={InstitutionLogin} options={{ headerShown: false }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
