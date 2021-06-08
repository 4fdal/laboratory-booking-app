import { Text, Button, Item, Icon, Left, Label, Input, View, Right, Form } from 'native-base';
import React from 'react';
import { DatePickerAndroid, Keyboard, TimePickerAndroid, TouchableOpacity } from 'react-native';
import { formatDate } from '../../app/helper/GlobalFunction';
import { blue } from '../../config/colors'

export default class DateTimeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value ?? null
    }
  }
  onClickInputText = (mode) => async () => {
    try {
      if (mode == 'date') {
        let { action, day, month, year } = await DatePickerAndroid.open({
          date: this.state.value,
          mode: 'spinner'
        })
        if (action == 'dateSetAction') {
          let value = new Date(year, month, day)
          if (this.props.onChange) {
            this.props.onChange(value)
          }
          this.setState({ value })
        }
      } else if (mode == 'time') {
        TimePickerAndroid.open({
          mode : 'spinner'
        })
      }
    } catch (error) {

    }
  }
  renderDateOrTime = () => {
    let mode = this.props.mode ?? 'time'
    let label = this.props.label ?? 'Date'
    let icon
    let value

    if (mode == 'date') {
      icon = 'calendar-outline'
      if (this.state.value != null) value = formatDate(this.state.value)
    } else if (mode == 'time') {
      icon = 'time-outline'
    }

    return <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
      <TouchableOpacity onPress={this.onClickInputText(mode)} >
        <Icon name={icon} type='Ionicons' style={{ color: blue }} />
      </TouchableOpacity>
      <Item style={{ paddingLeft: 10, paddingVertical: 10, width: '90%' }} >
        <Text onPress={this.onClickInputText(mode)}>{value}</Text>
      </Item>
    </View>
  }
  render = () => {
    return <View style={{
      flexDirection: 'column',
      marginLeft: 15,
      marginTop: 20,
    }}>
      {this.renderDateOrTime()}
    </View>
  };
}
