import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Fab,
  Icon,
  List,
  ListItem,
  Text,
  View,
} from 'native-base';
import React, {Component} from 'react';
import AppContext from '../../../app/context/AppContext';
import {
  handleErrors,
  redirectResetTo,
} from '../../../app/helper/GlobalFunction';
import {RequestAuth} from '../../../app/helper/request/Request';
import {blue} from '../../../config/colors';
import {Dimensions, FlatList, ScrollView, TouchableOpacity} from 'react-native';
import {
  STATUS_APPROVE,
  STATUS_NOT_APPROVE,
  STATUS_PENDING,
} from '../../../app/constant/payment';

class BookingLaboratoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPending: [],
      dataApproval: [],
      dataNotApproval: [],
    };
  }
  componentDidMount = () => {
    this.bookingLaboratoryRequestGets();
  };
  bookingLaboratoryRequestGets = async () => {
    try {
      let request = await RequestAuth(this.props);
      let {
        data: {data},
      } = await request.get('/v1/laboratory/booking/plea_submission/get');

      let dataPending = data[STATUS_PENDING] ?? [];
      let dataApproval = data[STATUS_APPROVE] ?? [];
      let dataNotApproval = data[STATUS_NOT_APPROVE] ?? [];

      this.setState({
        dataPending,
        dataApproval,
        dataNotApproval,
      });
    } catch (error) {
      handleErrors(this, error);
    }
  };
  renderItemList = ({item, index}) => {
    return (
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <Card>
          <CardItem
            onPress={() => {
              this.props.navigation.navigate('DetailBookingLaboratory', {
                scheduleBookingId: item.id,
                fromScreen: 'BookingLaboratoryScreen',
              });
            }}
            button
            header
            bordered
            style={{flexDirection: 'row'}}>
            <Text style={{width: '90%', color: blue}}>{item.title}</Text>
            <Icon
              style={{marginLeft: 10, color: blue}}
              name="chevron-forward-outline"
              type="Ionicons"
            />
          </CardItem>
          <CardItem style={{flexDirection: 'column', alignItems: 'flex-start'}}>
            <View
              style={{
                flexDirection: 'row',
                paddingTop: 10,
                alignItems: 'center',
              }}>
              <Icon
                style={{color: blue}}
                name="business-outline"
                type="Ionicons"
              />
              <View style={{flexDirection: 'column', marginLeft: 10}}>
                <Text style={{fontSize: 12}} style={{color: blue}}>
                  Laboratory
                </Text>
                <Text style={{fontSize: 14}}>{item.labor.name}</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                paddingTop: 10,
                alignItems: 'center',
              }}>
              <Icon style={{color: blue}} name="time-outline" type="Ionicons" />
              <View style={{flexDirection: 'column', marginLeft: 10}}>
                <View style={{flexDirection: 'column'}}>
                  <Text style={{fontSize: 12}} style={{color: blue}}>
                    Start Time Booking
                  </Text>
                  <Text style={{fontSize: 14}}>
                    {item.datetime_start_ordering}
                  </Text>
                </View>
                <View style={{flexDirection: 'column', marginTop: 10}}>
                  <Text style={{fontSize: 12}} style={{color: blue}}>
                    End Time Booking
                  </Text>
                  <Text style={{fontSize: 14}}>
                    {item.datetime_end_ordering}
                  </Text>
                </View>
              </View>
            </View>
          </CardItem>
        </Card>
      </View>
    );
  };
  render = () => {
    return (
      <Container>
        <ScrollView>
          <View style={{margin: 10}}>
            <Card>
              <CardItem header bordered>
                <Text>Approve Booking</Text>
              </CardItem>
              <CardItem cardBody style={{paddingBottom: 20}}>
                <FlatList
                  data={this.state.dataApproval}
                  renderItem={this.renderItemList}
                />
              </CardItem>
            </Card>
            <Card>
              <CardItem header bordered>
                <Text>Pending Approve Booking</Text>
              </CardItem>
              <CardItem cardBody style={{paddingBottom: 20}}>
                <FlatList
                  data={this.state.dataPending}
                  renderItem={this.renderItemList}
                />
              </CardItem>
            </Card>
            <Card>
              <CardItem header bordered>
                <Text>Not Approve Booking</Text>
              </CardItem>
              <CardItem cardBody style={{paddingBottom: 20}}>
                <FlatList
                  data={this.state.dataNotApproval}
                  renderItem={this.renderItemList}
                />
              </CardItem>
            </Card>
          </View>
        </ScrollView>
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
