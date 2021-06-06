import React, {Component} from 'react';
import AppContext from '../../app/context/AppContext';

class ExampleScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render = () => {
    return <></>;
  };
}

ExampleScreen.contextType = AppContext;

export default ExampleScreen;
