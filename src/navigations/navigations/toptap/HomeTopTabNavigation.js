import React, {Component, ReactNode} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AppContext from '../../../app/context/AppContext';
import {blue, white} from '../../../config/colors';
import HomeScreen from '../../../resource/screens/home/HomeScreen';
import UserLaboratoryScreen from '../../../resource/screens/user-laboratory/UserLaboratoryScreen';
import BookingLaboratoryScreen from '../../../resource/screens/booking-laboratory/BookingLaboratoryScreen';
import OptionsMenu from 'react-native-options-menu';
import {Icon} from 'native-base';
import {TouchableOpacity} from 'react-native';

const {Navigator, Screen} = createMaterialTopTabNavigator();

class HomeTopTabNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleHeader: 'Home',
    };
  }
  screenListener = event => {
    let titleHeader;
    switch (event?.route?.name) {
      case 'UserLaboratoryScreen':
        titleHeader = 'User Booking Laboratory';
        break;
      case 'BookingLaboratoryScreen':
        titleHeader = 'Booking Laboratory';
        break;

      default:
        titleHeader = 'Home';
        break;
    }
    this.props.navigation.setOptions({
      title: titleHeader,
      headerTitleStyle: {
        fontSize: 16,
        paddingRight: 10,
      },
      headerRight: this.renderHeaderRight,
    });
  };
  renderHeaderRight = props => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ProfileUserScreen')}
        style={{marginRight: 15}}>
        <Icon
          name="person-outline"
          style={{color: blue, fontSize: 20}}
          type="Ionicons"
        />
      </TouchableOpacity>
    );
  };
  render = () => {
    return (
      <Navigator
        screenListeners={this.screenListener}
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
