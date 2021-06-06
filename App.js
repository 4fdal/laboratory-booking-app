import { Root } from 'native-base';
import React, {Component} from 'react';
import MainApp from './src';
import AppContext from './src/app/context/AppContext';
import CombineMobx from './src/app/mobx/CombineMobx';

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
