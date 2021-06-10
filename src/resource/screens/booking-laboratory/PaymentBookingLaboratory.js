import {Observer} from 'mobx-react-lite';
import {
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Icon,
  Spinner,
  Text,
} from 'native-base';
import React, {Component} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AppContext from '../../../app/context/AppContext';
import {formatRupiah, handleErrors} from '../../../app/helper/GlobalFunction';
import {RequestAuth} from '../../../app/helper/request/Request';
import {red} from '../../../config/colors';

class PaymentBookingLaboratory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleBookingId: this.props.route.params.scheduleBookingId,
      paymentId: this.props.route.params.paymentId,
      scheduleBooking: {},
      isLoading: false,
    };
  }
  componentDidMount = () => {
    this.requestGetBookingSchedule();
  };
  requestGetBookingSchedule = async () => {
    this.setState({isLoading: true});
    try {
      let req = await RequestAuth(this.props);
      let {
        data: {
          data: {booking_schedule},
        },
      } = await req.get(
        `/v1/laboratory/booking/${this.state.scheduleBookingId}`,
      );

      console.log(booking_schedule);

      this.setState({scheduleBooking: booking_schedule});
    } catch (error) {
      handleErrors(error);
    }
    this.setState({isLoading: false});
  };
  renderObserver = () => {
    let {
      labor,
      payment,
      title,
      description,
      datetime_start_ordering,
      datetime_end_ordering,
    } = this.state.scheduleBooking;

    var name, booking_schedule, status, photo_payment_proof;

    if (labor) {
      var {name, borrowing_price} = labor;
    }

    if (payment) {
      var {status, photo_payment_proof} = payment;
    }

    return (
      <Container>
        <Content>
          <View style={{margin: 10}}>
            <Card>
              {this.state.isLoading && <Spinner color="primary" size="small" />}
              <CardItem
                header
                bordered
                style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                <View style={{flexDirection: 'column'}}>
                  <Text style={{fontSize: 12, color: 'black'}}>
                    Title Booking
                  </Text>
                  <Text style={{fontSize: 14}}>{title}</Text>
                </View>
                <View style={{flexDirection: 'column', marginTop: 10}}>
                  <Text style={{fontSize: 12, color: 'black'}}>Laboratory</Text>
                  <Text style={{fontSize: 14}}>{name}</Text>
                </View>
                <View style={{flexDirection: 'column', marginTop: 10}}>
                  <Text style={{fontSize: 12, color: 'black'}}>Fee</Text>
                  <Text style={{fontSize: 14}}>
                    IDR. {formatRupiah(borrowing_price + '')}
                  </Text>
                </View>
              </CardItem>
              <CardItem
                cardBody
                style={{
                  marginLeft: 15,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}>
                <View style={{flexDirection: 'column', marginTop: 10}}>
                  <Text style={{fontSize: 12, color: 'black'}}>
                    Start Booking
                  </Text>
                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                    {datetime_start_ordering}
                  </Text>
                </View>
                <View style={{flexDirection: 'column', marginTop: 10}}>
                  <Text style={{fontSize: 12, color: 'black'}}>
                    End Booking
                  </Text>
                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                    {datetime_end_ordering}
                  </Text>
                </View>
                <View style={{flexDirection: 'column', marginTop: 10}}>
                  <Text style={{fontSize: 12, color: 'black'}}>
                    Description
                  </Text>
                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                    {description}
                  </Text>
                </View>
                <TouchableOpacity>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Icon
                      type="FontAwesome5"
                      name="file-pdf"
                      style={{color: red}}
                    />
                    <Text style={{fontSize: 12, color: red}}>
                      Borrow PDF Report
                    </Text>
                  </View>
                </TouchableOpacity>
              </CardItem>
              <CardItem footer>
                <View style={{marginTop: 50, flex: 1}}>
                  <Button full style={{paddingHorizontal: 10}}>
                    <Icon name="money-check-alt" type="FontAwesome5" />
                    <Text>Upload proof of payment</Text>
                  </Button>
                </View>
              </CardItem>
            </Card>
          </View>
        </Content>
      </Container>
    );
  };
  render = () => {
    return <Observer>{this.renderObserver}</Observer>;
  };
}

PaymentBookingLaboratory.contextType = AppContext;

export default PaymentBookingLaboratory;
