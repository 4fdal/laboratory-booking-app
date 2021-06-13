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
import {Alert, Dimensions, Linking, Modal, View} from 'react-native';
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
import {getConfig} from '../../../app/helper/MobxFunction';

class DetailBookingLaboratory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleBookingId: this.props?.route?.params?.scheduleBookingId,
      fromScreen: this.props?.route?.params?.fromScreen,
      scheduleBooking: {},
      isLoading: false,
      isShowImage: false,
      imageSource: null,
      isShowPaymentTerm: false,
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
    } else {
      title = 'Detail Booking Laboratory';
    }
    this.props.navigation.setOptions({
      title,
      headerRight: this.renderHeaderRight,
      headerTitleStyle: {
        fontSize: 16,
        paddingRight: 10,
      },
    });
  };
  renderHeaderRight = props => {
    let statusNotPending = this.isNotPendingStatusPayment();
    let color = statusNotPending ? darkGray : blue;
    let {scheduleBooking} = this.state;
    let {
      payment: {photo_payment_proof},
    } = scheduleBooking;

    return (
      <View style={{marginRight: 20, flex: 1, flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('EditBookingLaboratoryScreen', {
              scheduleBooking,
            });
          }}
          disabled={statusNotPending}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 10,
          }}>
          <Icon style={{color}} type="Ionicons" name="create-outline" />
          <Text style={{color}}>Edit</Text>
        </TouchableOpacity>
        {this.state.imageSource == null && (
          <TouchableOpacity
            onPress={() => {
              let {scheduleBooking} = this.state;
              Alert.alert(
                `Delete ${scheduleBooking.name}`,
                'Are you sure you want to delete this data? ',
                [
                  {
                    onPress: async () => {
                      try {
                        let req = await RequestAuth(this.props);
                        let data = await req.delete(
                          `${ApiBaseUrl}/v1/laboratory/booking/plea_submission/delete?schedule_booking_id=${scheduleBooking.id}`,
                        );
                        Toast.show({text: 'Delete Success', type: 'success'});

                        this.props.navigation.goBack();
                      } catch (error) {
                        console.log(error);
                        // handleErrors(error);
                      }
                    },
                    text: 'Delete',
                    style: 'default',
                  },
                ],
              );
            }}
            disabled={statusNotPending}
            style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Icon style={{color}} type="Ionicons" name="close-outline" />
            <Text style={{color}}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  componentDidMount = async () => {
    let requests = async () => {
      await this.requestGetBookingSchedule();
      await this.setNavigationOptions();
    };
    this.props.navigation.addListener('focus', async e => {
      await requests();
    });
    if (JSON.stringify(this.state.scheduleBooking) == '{}') {
      await requests();
    }
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

              let {scheduleBooking} = this.state;
              scheduleBooking.payment.status = booking_schedule.payment.status;

              let {
                payment: {photo_payment_proof},
              } = booking_schedule;

              this.setState({
                imageSource: photo_payment_proof,
                scheduleBooking,
              });
            }
          } catch (error) {
            handleErrors(error);
          }
          this.setState({isLoading: false});
        },
      );
    } catch (error) {}
  };
  onDownloadPdfReport = async () => {
    try {
      let token = await getAuthenticateToken();
      if (token) {
        let urlPDF = `${ApiBaseUrl}/v1/laboratory/booking/plea_submission/${this.state.scheduleBookingId}/pdf?token=${token}`;

        this.props.navigation.navigate('PDFScreen', {urlPDF});
      }
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
      supervisors_nip,
      supervisors_name,
      hal,
    } = this.state.scheduleBooking;

    var name, booking_schedule, status, photo_payment_proof;

    if (labor) {
      var {name, borrowing_price} = labor;
    }

    if (payment) {
      var {status} = payment;
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
                    Approval Status
                  </Text>
                  <Text style={{fontSize: 18}}>{status?.toUpperCase()}</Text>
                </View>
                <View style={{flexDirection: 'column', marginTop: 10}}>
                  <Text style={{fontSize: 12, color: 'black'}}>
                    Title Booking
                  </Text>
                  <Text style={{fontSize: 14}}>{title}</Text>
                </View>
                <View style={{flexDirection: 'column', marginTop: 10}}>
                  <Text style={{fontSize: 12, color: 'black'}}>Laboratory</Text>
                  <Text style={{fontSize: 14}}>{name}</Text>
                </View>
              </CardItem>
              <CardItem
                bordered
                cardBody
                style={{
                  marginTop: 5,
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
                  <Text style={{fontSize: 12, color: 'black'}}>Hal</Text>
                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>{hal}</Text>
                </View>
                <View style={{flexDirection: 'column', marginTop: 10}}>
                  <Text style={{fontSize: 12, color: 'black'}}>
                    End Booking
                  </Text>
                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                    {supervisors_nip}
                  </Text>
                </View>
                <View style={{flexDirection: 'column', marginTop: 10}}>
                  <Text style={{fontSize: 12, color: 'black'}}>
                    End Booking
                  </Text>
                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                    {supervisors_name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    marginTop: 10,
                    marginBottom: 20,
                    width: '95%',
                  }}>
                  <Text style={{fontSize: 12, color: 'black'}}>
                    Description
                  </Text>
                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                    {description}
                  </Text>
                </View>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <TouchableOpacity onPress={this.onDownloadPdfReport}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
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
            <Card>
              <CardItem
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  flex: 1,
                }}>
                <View style={{flexDirection: 'column', marginTop: 10}}>
                  <Text style={{fontSize: 12, color: 'black'}}>
                    Fee Laboratory Borrow
                  </Text>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    IDR. {formatRupiah(borrowing_price + '')}
                  </Text>
                  <Button
                    onPress={() => {
                      this.setState({isShowPaymentTerm: true});
                    }}
                    style={{alignContent: 'flex-end'}}>
                    <Text>Payment Terms</Text>
                  </Button>
                  <Modal
                    transparent={true}
                    visible={this.state.isShowPaymentTerm}>
                    <View
                      style={{
                        flex: 1,
                        padding: 10,
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                      }}>
                      <Card>
                        <CardItem header bordered>
                          <Text>Payment Terms</Text>
                        </CardItem>
                        <CardItem cardBody>
                          <View style={{margin: 15}}>
                            <Text>{getConfig(this, 'payment-terms')}</Text>
                          </View>
                        </CardItem>
                        <Button
                          full
                          onPress={() =>
                            this.setState({isShowPaymentTerm: false})
                          }>
                          <Text>Ok</Text>
                        </Button>
                      </Card>
                    </View>
                  </Modal>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    marginBottom: 10,
                    marginTop: 10,
                  }}>
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

DetailBookingLaboratory.contextType = AppContext;

export default DetailBookingLaboratory;
