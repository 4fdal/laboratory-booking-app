import React, {Component, ReactNode} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AppContext from '../../../app/context/AppContext';
import {blue, white} from '../../../config/colors';
import HomeScreen from '../../../resource/screens/home/HomeScreen';
import UserLaboratoryScreen from '../../../resource/screens/user-laboratory/UserLaboratoryScreen';
import BookingLaboratoryScreen from '../../../resource/screens/booking-laboratory/BookingLaboratoryScreen';

const {Navigator, Screen} = createMaterialTopTabNavigator();

class HomeTopTabNavigation extends Component {
  render = () => {
    return (
      <Navigator
        screenOptions={{
          tabBarInactiveTintColor: blue,
          tabBarActiveTintColor: blue,
          tabBarPressColor: white,
          tabBarIndicatorStyle: {
            backgroundColor: blue,
          },
          tabBarStyle: {
            backgroundColor: white,
          },
          tabBarLabelStyle: {
            fontSize: 10,
          },
        }}>
        <Screen
          component={HomeScreen}
          options={{
            title: 'Schedule',
          }}
          name="HomeScreen"
        />
        <Screen
          component={UserLaboratoryScreen}
          options={{
            title: 'Laboratory',
          }}
          name="UserLaboratoryScreen"
        />
        <Screen
          component={BookingLaboratoryScreen}
          options={{
            title: 'Booking',
          }}
          name="BookingLaboratoryScreen"
        />
      </Navigator>
    );
  };
}

HomeTopTabNavigation.contextType = AppContext;

export default HomeTopTabNavigation;
