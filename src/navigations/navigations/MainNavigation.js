import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
import AppContext from '../../app/context/AppContext';
import ForgetPasswordScreen from '../../resource/screens/auth/ForgetPasswordScreen';
import LoginScreen from '../../resource/screens/auth/LoginScreen';
import RegisterScreen from '../../resource/screens/auth/RegisterScreen';
import ResetPasswordScreen from '../../resource/screens/auth/ResetPasswordScreen';
import UserVerificationScreen from '../../resource/screens/auth/UserVerificationScreen';
import FormBookingLaboratoryScreen from '../../resource/screens/booking-laboratory/FormBookingLaboratoryScreen';
import DetailBookingLaboratory from '../../resource/screens/booking-laboratory/DetailBookingLaboratory';
import ListLaboratoryBooking from '../../resource/screens/laboratory/ListLaboratoryBooking';
import PDFScreen from '../../resource/screens/pdf/PDFScreen';
import SplashScreen from '../../resource/screens/splash/SplashScreen';
import HomeTopTapNavigation from './toptap/HomeTopTabNavigation';
import ProfileUserScreen from '../../resource/screens/user/ProfileUserScreen';

let {Screen, Navigator} = createStackNavigator();

class MainNavigation extends Component {
  render = () => {
    return (
      <NavigationContainer>
        <Navigator>
          <Screen
            options={{
              headerShown: false,
            }}
            component={SplashScreen}
            name="SplashScreen"
          />
          <Screen
            options={{
              title: 'Login',
              headerTitleStyle: {
                fontSize: 14,
              },
            }}
            component={LoginScreen}
            name="LoginScreen"
          />
          <Screen
            options={{
              title: 'Register',
              headerTitleStyle: {
                fontSize: 14,
              },
            }}
            component={RegisterScreen}
            name="RegisterScreen"
          />
          <Screen
            options={{
              title: 'Register Verification Account',
              headerTitleStyle: {
                fontSize: 14,
              },
            }}
            component={UserVerificationScreen}
            name="UserVerificationScreen"
          />
          <Screen
            options={{
              title: 'Forget Password',
              headerTitleStyle: {
                fontSize: 14,
              },
            }}
            component={ForgetPasswordScreen}
            name="ForgetPasswordScreen"
          />
          <Screen
            options={{
              title: 'Reset Password',
              headerTitleStyle: {
                fontSize: 14,
              },
            }}
            component={ResetPasswordScreen}
            name="ResetPasswordScreen"
          />
          <Screen
            options={{
              title: 'Home',
            }}
            component={HomeTopTapNavigation}
            name="Home"
          />
          <Screen
            options={{
              title: 'User Profile',
              headerTitleStyle: {
                fontSize: 14,
              },
            }}
            component={ProfileUserScreen}
            name="ProfileUserScreen"
          />
          <Screen
            options={{
              title: 'Laboratory List',
            }}
            component={ListLaboratoryBooking}
            name="ListLaboratoryBooking"
          />
          <Screen
            options={{
              title: 'Add New Booking Laboratory',
            }}
            component={FormBookingLaboratoryScreen}
            name="FormBookingLaboratoryScreen"
          />
          <Screen
            options={{
              title: 'Payment Booking Laboratory',
            }}
            component={DetailBookingLaboratory}
            name="DetailBookingLaboratory"
          />
          <Screen
            options={{
              title: 'Document Report',
            }}
            component={PDFScreen}
            name="PDFScreen"
          />
        </Navigator>
      </NavigationContainer>
    );
  };
}

MainNavigation.contextType = AppContext;

export default MainNavigation;
