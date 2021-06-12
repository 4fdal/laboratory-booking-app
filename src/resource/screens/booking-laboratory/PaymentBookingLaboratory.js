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
  Toast,
} from 'native-base';
import React, {Component} from 'react';
import {Dimensions, Modal, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AppContext from '../../../app/context/AppContext';
import {
  formatRupiah,
  getAuthenticateToken,
  handleErrors,
} from '../../../app/helper/GlobalFunction';
import {RequestAuth} from '../../../app/helper/request/Request';
import {blue, darkGray, red} from '../../../config/colors';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AutoHeightImage from 'react-native-auto-height-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import {STATUS_PENDING} from '../../../app/constant/payment';
import RNFetchBlob from 'rn-fetch-blob';
import {ApiBaseUrl} from '../../../config/api';

class PaymentBookingLaboratory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleBookingId:
        this.props?.route?.params?.scheduleBookingId ??
        '088e4a8e-7b8a-49d1-ae70-401040d3aa29',
      fromScreen: this.props?.route?.params?.fromScreen,
      scheduleBooking: {},
      isLoading: false,
      isShowImage: false,
      imageSource: null,

      strButtonUploadImage: 'Upload proof of payment',
    };
  }
  isNotPendingStatusPayment = () => {
    try {
      let {payment} = this.state.scheduleBooking;
      let {status} = payment;
      let statusNotPending = STATUS_PENDING !== status;
      return statusNotPending;
    } catch (error) {
      return true;
    }
  };
  setNavigationOptions = () => {
    let title;

    if (this.state.fromScreen == 'FormBookingLaboratoryScreen') {
      title = 'Payment Booking Laboratory';
    }
    this.props.navigation.setOptions({
      title,
      headerRight: this.renderHeaderRight,
    });
  };
  renderHeaderRight = props => {
    let statusNotPending = this.isNotPendingStatusPayment();
    let color = statusNotPending ? darkGray : blue;

    return (
      <View style={{marginRight: 20}}>
        <TouchableOpacity
          disabled={statusNotPending}
          style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            style={{fontSize: 24, color}}
            type="Ionicons"
            name="create-outline"
          />
          <Text style={{color}}>Edit</Text>
        </TouchableOpacity>
      </View>
    );
  };
  componentDidMount = async () => {
    await this.requestGetBookingSchedule();
    await this.setNavigationOptions();
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

      let {
        payment: {photo_payment_proof},
      } = booking_schedule;

      this.setState({
        scheduleBooking: booking_schedule,
        imageSource: photo_payment_proof,
      });
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
          includeBase64: true,
        },
        async response => {
          this.setState({isLoading: true});
          try {
            let {
              assets: [{type, fileName, uri}],
            } = response;

            let {scheduleBookingId} = this.state;
            let token = await getAuthenticateToken();

            if (token) {
              const formData = new FormData();
              formData.append('file', {
                type,
                name: fileName,
                uri,
              });
              formData.append('schedule_booking_id', scheduleBookingId);

              let req = await RequestAuth(this.props);
              let {
                data: {
                  data: {booking_schedule},
                },
              } = await req.post(
                `${ApiBaseUrl}/v1/laboratory/booking/plea_submission/payment/upload`,
                formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                },
              );

              let {
                payment: {photo_payment_proof},
              } = booking_schedule;

              this.setState({
                imageSource: photo_payment_proof,
                scheduleBooking: booking_schedule,
              });
            }
          } catch (error) {
            handleErrors(error);
          }
          this.setState({isLoading: true});
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
                      marginTop: 20,
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
                    disabled={this.isNotPendingStatusPayment()}
                    onPress={this.onClickButtonUploadProofOfPayment}
                    full
                    style={{paddingHorizontal: 10}}>
                    {this.state.isLoading ? (
                      <Spinner color="white" size="small" />
                    ) : (
                      <Icon name="money-check-alt" type="FontAwesome5" />
                    )}
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
