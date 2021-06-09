import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Text, Button, Item, Icon, Left, Label, Input, View, Right, Form, DatePicker } from 'native-base';
import React from 'react';
import { DatePickerAndroid, Keyboard, TimePickerAndroid, TouchableOpacity } from 'react-native';
import { formatDate, formatTime, formatTime12Hours } from '../../app/helper/GlobalFunction';
import { blue } from '../../config/colors'

export default class DateTimeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value ?? new Date(),
      dateTimeStatus: false,
    }
  }
  onClickInputText = (mode) => async () => {
    this.setState({ dateTimeStatus: true })
  }
  onDateOrTimeChangeValue = (mode) => ({ nativeEvent: { timestamp }, type }) => {
    this.setState({dateTimeStatus: false});
    if (type == 'set') {
      let value = new Date(timestamp)
      this.setState({ value})
      if (this.props.onChange) {
        this.props.onChange(value)
      }
    }
  }
  renderDateOrTime = () => {
    let mode = this.props.mode ?? 'time'
    let icon;
    let inputValue = null

    if (mode == 'date') {
      icon = 'calendar-outline'
      inputValue = formatDate(this.props.value ?? new Date());
    } else if (mode == 'time') {
      icon = 'time-outline'
      inputValue = formatTime12Hours(this.props.value ?? new Date())
    }

    return <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
      <TouchableOpacity onPress={this.onClickInputText(mode)} >
        <Icon name={icon} type='Ionicons' style={{ color: blue }} />
      </TouchableOpacity>
      <Item style={{ paddingLeft: 10, paddingVertical: 10, width: '90%' }} >
        <Text onPress={this.onClickInputText(mode)}>{inputValue}</Text>
      </Item>
      {this.state.dateTimeStatus && <RNDateTimePicker show={true} onChange={this.onDateOrTimeChangeValue(mode)} mode={mode} value={this.state.value} />}
    </View>
  }
  render = () => {
    let label = this.props.label ?? 'Date/Time'
    return <View style={{
      flexDirection: 'column',
      marginLeft: 15,
      marginTop: 20,
    }}>
      <Label>{label}</Label>
      {this.renderDateOrTime()}
    </View>
  };
}
