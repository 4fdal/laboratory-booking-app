import {
  Button,
  Card,
  CardItem,
  Container,
  Content,
  DatePicker,
  Form,
  Icon,
  Input,
  Item,
  Label,
  Text,
  View,
} from 'native-base';
import React, {Component} from 'react';
import AppContext from '../../../app/context/AppContext';
import {blue, indigo} from '../../../config/colors';
import DateTimeInput from '../../components/DateTimeInput';

class FormBookingLaboratoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      laboratoryId: null,
      date_start_ordering: new Date(),
      time_start_ordering: new Date(),
      date_end_ordering: new Date(),
      time_end_ordering: new Date(),
      title : '',
      description : '',
    };
  }
  componentDidMount = () => {
    if (this.props.route.params) {
      let {laboratoryId} = this.props.route.params;
      this.setState({laboratoryId});
    }
  };
  onChangeDateTime = (stateName) => ({nativeEvent: {timestamp}}) => {
    if(timestamp){

    }
  }
  render = () => {
    return (
      <Container>
        <Content>
          <View style={{margin: 10, flex: 1}}>
            <Card>
              <CardItem cardBody>
                <Form style={{width: '95%'}}>
                  <Item floatingLabel>
                    <Label>Title Borrow</Label>
                    <Input style={{marginVertical: 5}} />
                  </Item>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      marginLeft: 15,
                      marginTop: 40,
                    }}>
                    <View>
                      <Text style={{color: 'gray'}}>Start Borrow</Text>
                      <DateTimeInput />
                      <Item>
                        <Icon
                          name="calendar-outline"
                          style={{color: blue}}
                          type="Ionicons"
                        />
                        <DatePicker
                          Label="Hello"
                          is24Hour={true}
                          locale={'id'}
                          animationType={'fade'}
                          mode="dateTime"
                          androidMode="spinner"
                          defaultDate={this.state.date_start_ordering}
                          value={this.state.date_start_ordering}
                          modalTransparent={true}
                          placeHolderText="Date"
                          textStyle={{color: 'green'}}
                          placeHolderTextStyle={{color: '#d3d3d3'}}
                          onChange={this.onChangeDateTime('date_start_ordering')}
                        />
                      </Item>
                      <Item>
                        <Icon
                          name="time-outline"
                          style={{color: blue}}
                          type="Ionicons"
                        />
                        <DatePicker
                          is24Hour={true}
                          locale={'id'}
                          animationType={'fade'}
                          mode="time"
                          androidMode="spinner"
                          defaultDate={this.state.datetime_start_ordering}
                          value={this.state.datetime_start_ordering}
                          modalTransparent={true}
                          placeHolderText="Time"
                          textStyle={{color: 'green'}}
                          placeHolderTextStyle={{color: '#d3d3d3'}}
                          onChange={date => console.log(date)}
                        />
                      </Item>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      marginLeft: 15,
                      marginTop: 20,
                    }}>
                    <View>
                      <Text style={{color: 'gray'}}>End Borrow</Text>
                      <Item>
                        <Icon
                          name="calendar-outline"
                          style={{color: blue}}
                          type="Ionicons"
                        />
                        <DatePicker
                          is24Hour={true}
                          locale={'id'}
                          animationType={'fade'}
                          mode="date"
                          androidMode="spinner"
                          defaultDate={this.state.datetime_start_ordering}
                          value={this.state.datetime_start_ordering}
                          modalTransparent={true}
                          placeHolderText="Date"
                          textStyle={{color: 'green'}}
                          placeHolderTextStyle={{color: '#d3d3d3'}}
                          onChange={date => console.log(date)}
                        />
                      </Item>
                      <Item>
                        <Icon
                          name="time-outline"
                          style={{color: blue}}
                          type="Ionicons"
                        />
                        <DatePicker
                          is24Hour={true}
                          locale={'id'}
                          animationType={'fade'}
                          mode="time"
                          androidMode="spinner"
                          defaultDate={this.state.datetime_start_ordering}
                          value={this.state.datetime_start_ordering}
                          modalTransparent={true}
                          placeHolderText="Time"
                          textStyle={{color: 'green'}}
                          placeHolderTextStyle={{color: '#d3d3d3'}}
                          onChange={date => console.log(date)}
                        />
                      </Item>
                    </View>
                  </View>
                  <Item floatingLabel>
                    <Label>Description Borrow</Label>
                    <Input multiline style={{marginVertical: 5}} />
                  </Item>
                </Form>
              </CardItem>
              <CardItem footer>
                <View style={{flex: 1, marginTop: 10}}>
                  <Button>
                    <Text>Payment</Text>
                  </Button>
                </View>
              </CardItem>
            </Card>
          </View>
        </Content>
      </Container>
    );
  };
}

FormBookingLaboratoryScreen.contextType = AppContext;

export default FormBookingLaboratoryScreen;
