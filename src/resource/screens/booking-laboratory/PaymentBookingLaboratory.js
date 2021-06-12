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
import {Dimensions, Modal, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AppContext from '../../../app/context/AppContext';
import {formatRupiah, handleErrors} from '../../../app/helper/GlobalFunction';
import {RequestAuth} from '../../../app/helper/request/Request';
import {red} from '../../../config/colors';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AutoHeightImage from 'react-native-auto-height-image';
import ImageViewer from 'react-native-image-zoom-viewer';

class PaymentBookingLaboratory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleBookingId: '088e4a8e-7b8a-49d1-ae70-401040d3aa29',
      // scheduleBookingId: this.props.route.params.scheduleBookingId,
      // paymentId: this.props.route.params.paymentId,
      scheduleBooking: {},
      isLoading: false,
      isShowImage: false,
      imageSource: null,

      strButtonUploadImage : 'Upload proof of payment'
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
  onClickButtonUploadProofOfPayment = async () => {
    try {
      launchCamera(
        {
          mediaType: 'photo',
          cameraType: 'back',
          saveToPhotos: true,
        },
        async response => {
          try {
            let {
              assets: [{uri}],
            } = response;
            this.setState({imageSource: uri});
          } catch (error) {}
        },
      );
    } catch (error) {}
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
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      marginBottom: 20,
                    }}>
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
            </Card>
            {this.state.imageSource != null && (
              <Card>
                <CardItem
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    flex: 1,
                  }}>
                  <Text
                    style={{fontSize: 12, color: 'black', marginBottom: 10}}>
                    Proof of payment
                  </Text>
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <TouchableOpacity
                      onPress={() => this.setState({isShowImage: true})}>
                      <AutoHeightImage
                        width={Dimensions.get('screen').width - 60}
                        source={{uri: this.state.imageSource}}
                      />
                    </TouchableOpacity>
                  </View>
                </CardItem>
              </Card>
            )}
            <Card>
              <CardItem footer style={{flexDirection: 'column'}}>
                <View style={{flex: 1}}>
                  <Button
                    onPress={this.onClickButtonUploadProofOfPayment}
                    full
                    style={{paddingHorizontal: 10}}>
                    <Icon name="money-check-alt" type="FontAwesome5" />
                    <Text>Upload proof of payment</Text>
                  </Button>
                </View>
              </CardItem>
            </Card>
          </View>
          <Modal visible={this.state.isShowImage} transparent={true}>
            <ImageViewer
              enableSwipeDown={true}
              onSwipeDown={() => this.setState({isShowImage: false})}
              imageUrls={[{url: this.state.imageSource}]}
            />
          </Modal>
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
