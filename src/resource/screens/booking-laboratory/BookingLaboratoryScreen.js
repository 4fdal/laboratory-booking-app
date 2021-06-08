import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Container, Content, Fab, Icon, View} from 'native-base';
import React, {Component} from 'react';
import AppContext from '../../../app/context/AppContext';
import {
  handleErrors,
  redirectResetTo,
} from '../../../app/helper/GlobalFunction';
import {RequestAuth} from '../../../app/helper/request/Request';
import {blue} from '../../../config/colors';

class BookingLaboratoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {
    this.bookingLaboratoryRequestGets();
  };
  bookingLaboratoryRequestGets = async () => {
    try {
      let request = await RequestAuth(this.props);
      let {data} = await request.get('/v1/laboratory/booking');
      console.log(data);
    } catch (error) {
      handleErrors(this, error);
    }
  };
  render = () => {
    return (
      <Container>
        <Content></Content>
        <View style={{flex: 1}}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{}}
            style={{backgroundColor: blue}}
            position="bottomRight"
            onPress={() =>
              this.props.navigation.navigate('ListLaboratoryBooking')
            }>
            <Icon name="add" />
          </Fab>
        </View>
      </Container>
    );
  };
}

BookingLaboratoryScreen.contextType = AppContext;

export default BookingLaboratoryScreen;
