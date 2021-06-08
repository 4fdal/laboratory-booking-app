import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import AppContext from '../../../app/context/AppContext';
import {keyTokenSaveLocalStorage} from '../../../config/app';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  redirect = nameScreen =>
    this.props.navigation.reset({index: 0, routes: [{name: 'Home'}]});
  componentDidMount = () => {
    AsyncStorage.getItem(keyTokenSaveLocalStorage)
      .then(token => {
        if (token) {
          return this.redirect('Home');
        }

        return this.redirect('LoginScreen');
      })
      .catch(errors => {
        return this.redirect('LoginScreen');
      });
  };
  render = () => {
    return <></>;
  };
}

SplashScreen.contextType = AppContext;

export default SplashScreen;
