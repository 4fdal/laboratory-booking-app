import { Root } from 'native-base';
import React, { Component } from 'react';
import MainApp from './src';
import AppContext from './src/app/context/AppContext';
import CombineMobx from './src/app/mobx/CombineMobx';
import { BackdropProvider } from 'react-native-propel-kit'

console.disableYellowBox = true;

export default class App extends Component {
  render = () => {
    return (
      <AppContext.Provider value={CombineMobx}>
        <Root>
          <MainApp />
        </Root>
      </AppContext.Provider>
    );
  };
}
