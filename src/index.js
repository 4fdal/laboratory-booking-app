import {Observer} from 'mobx-react-lite';
import React, {Component} from 'react';
import AppContext from './app/context/AppContext';
import {StatusBar} from 'react-native';
import MainNavigation from './navigations/navigations/MainNavigation';

class MainApp extends Component {
  renderObserver = () => {
    return (
      <React.Fragment>
        <StatusBar barStyle="default"/>
        <MainNavigation />
      </React.Fragment>
    );
  };
  render = () => <Observer>{this.renderObserver}</Observer>;
}

MainApp.contextType = AppContext;

export default MainApp;
