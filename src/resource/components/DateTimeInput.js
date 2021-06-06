import {Text, View} from 'native-base';
import React from 'react';
import {DatePickerModal} from 'react-native-paper-dates';

export default class DateTimeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      time: '',
    };
  }
  onChangeDateTime =
    stateName =>
    ({nativeEvent: {timestamp}}) => {
      if (timestamp) {
      }
    };
  render = () => {
    return (
      <View>
        <Text>Hello world</Text>
        <DatePickerModal
          mode="multiple"
          visible={false}
          date={this.state.date}
        />
      </View>
    );
  };
}
