import React from 'react';
import {Text} from 'native-base';
import {red} from '../../config/colors';

export default class TextError extends React.Component {
  constructor(props) {
    super(props);
  }
  render = () => {
    const style = this.props.style ?? {};
    return (
      <Text style={{fontSize: 12, color: red, ...style}}>
        {this.props.text ?? null}
      </Text>
    );
  };
}
