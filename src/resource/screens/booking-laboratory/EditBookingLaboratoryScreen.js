import {Observer} from 'mobx-react-lite';
import {
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Form,
  Icon,
  Input,
  Item,
  Label,
  List,
  ListItem,
  Spinner,
  Text,
  Toast,
  View,
} from 'native-base';
import React, {Component} from 'react';
import {Modal, Picker, TouchableOpacity} from 'react-native';
import AppContext from '../../../app/context/AppContext';
import {
  formatDateTime,
  formatRupiah,
  handleErrors,
} from '../../../app/helper/GlobalFunction';
import {isLoading, setLoading} from '../../../app/helper/MobxFunction';
import AxiosErrors from '../../../app/helper/request/AxiosErrors';
import {Request, RequestAuth} from '../../../app/helper/request/Request';
import {blue, indigo} from '../../../config/colors';
import AttachmentInput from '../../components/AttachmentInput';
import DateTimeInput from '../../components/DateTimeInput';
import TextError from '../../components/TextError';
import {FlatList} from 'react-native';

class EditBookingLaboratoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLaboratory: [],
      laboratory: {},
      dateTimeStartOrdering: new Date(),
      dateTimeEndOrdering: new Date(),
      title: '',
      description: '',
      hal: '',
      supervisors_nip: '',
      supervisors_name: '',
      invalidate: {
        datetime_start_booking: null,
        datetime_end_booking: null,
        title: null,
        description: null,
        hal: null,
        supervisors_nip: null,
        supervisors_name: null,
      },
      freeTimeBooking: [],
      selectedFreeTimeBooking: '',
      isLoading: false,
      isShowModalLaboratory: false,
    };
  }
  componentDidMount = async () => {
    await this.requestGetLabor();
    await this.generateStateFromProps();
  };
  generateStateFromProps = () => {
    let scheduleBooking = this.props.route?.params?.scheduleBooking;
    let {
      labor_id,
      title,
      description,
      hal,
      supervisors_nip,
      datetime_start_ordering,
      datetime_end_ordering,
      supervisors_name,
    } = scheduleBooking;
    let laboratory = this.state.dataLaboratory.find(
      item => item.id == labor_id,
    );

    this.setState({
      title,
      description,
      hal,
      supervisors_nip,
      datetime_start_ordering,
      datetime_end_ordering,
      supervisors_name,
      laboratory,
      dateTimeStartOrdering: new Date(
        datetime_start_ordering.replace(/-/g, '/'),
      ),
      dateTimeEndOrdering: new Date(datetime_end_ordering.replace(/-/g, '/')),
    });
  };
  requestGetLabor = async () => {
    try {
      let {
        data: {data},
      } = await Request.get('/v1/data/labor');
      this.setState({dataLaboratory: data});
    } catch (error) {
      handleErrors(error);
    }
  };
  requestGetFreeTimeBooking = async () => {
    try {
      let request = await RequestAuth(this.props);
      let {
        data: {
          data: {free_booking_time},
        },
      } = await request.get(
        `/v1/laboratory/booking/free_booking_time/${this.state.laboratory.id}`,
      );

      if (free_booking_time[0]) {
        let [startTime, endTime] = free_booking_time[0];

        let dateTimeStartOrdering =
          startTime != null ? new Date(startTime.replace(/-/g, '/')) : null;
        let dateTimeEndOrdering =
          endTime != null ? new Date(endTime.replace(/-/g, '/')) : null;

        this.setState({dateTimeStartOrdering, dateTimeEndOrdering});
      }
      this.setState({freeTimeBooking: free_booking_time});
    } catch (error) {
      handleErrors(this, error);
    }
  };
  onClickPaymentButton = async () => {
    setLoading(this, true);
    try {
      let scheduleBooking = this.props.route?.params?.scheduleBooking;

      let {
        dateTimeEndOrdering,
        dateTimeStartOrdering,
        title,
        description,
        laboratory: {id},
        hal,
        supervisors_nip,
        supervisors_name,
      } = this.state;
      let dataRequest = {
        booking_schedule_id: scheduleBooking.id,
        labor_id: id,
        title,
        description,
        datetime_start_booking: formatDateTime(dateTimeStartOrdering),
        datetime_end_booking: formatDateTime(dateTimeEndOrdering),
        hal,
        supervisors_nip,
        supervisors_name,
      };

      let request = await RequestAuth(this.props);
      let {
        data: {
          data: {booking_schedule, payment},
        },
      } = await request.put(
        '/v1/laboratory/booking/plea_submission/edit',
        dataRequest,
      );

      this.props.navigation.goBack({
        scheduleBookingId: booking_schedule.id,
        fromScreen: 'EditBookingLaboratoryScreen',
      });
    } catch (error) {
      this.requestGetFreeTimeBooking();
      handleErrors(this, error);
    }
    setLoading(this, false);
  };
  renderObserver = () => {
    return (
      <Container>
        <Content>
          <View style={{margin: 10, flex: 1}}>
            <Card>
              <CardItem
                header
                bordered
                style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                <Label style={{fontSize: 12}}>Laboratory</Label>
                <Button
                  bordered
                  onPress={() => this.setState({isShowModalLaboratory: true})}>
                  <Text>{this.state?.laboratory?.name}</Text>
                  <Icon name="chevron-down-outline" />
                </Button>
                <Modal
                  transparent={true}
                  visible={this.state.isShowModalLaboratory}>
                  <View
                    style={{
                      flex: 1,
                      padding: 10,
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      justifyContent: 'center',
                    }}>
                    <Card>
                      <View style={{margin: 10}}>
                        <FlatList
                          data={this.state.dataLaboratory}
                          renderItem={({item, index}) => (
                            <ListItem
                              selected={item.id == this.state.laboratory.id}
                              onPress={async () => {
                                await this.setState({
                                  laboratory: item,
                                  isShowModalLaboratory: false,
                                });
                                await this.requestGetFreeTimeBooking();
                              }}>
                              <View
                                style={{width: '95%', flexDirection: 'column'}}>
                                <Text>{item.name}</Text>
                                <Text style={{color: blue}}>
                                  IDR. {formatRupiah(item.borrowing_price)}
                                </Text>
                              </View>
                              <Icon name="chevron-forward-outline" />
                            </ListItem>
                          )}
                        />
                      </View>
                    </Card>
                  </View>
                </Modal>

                <Label style={{fontSize: 12, marginTop: 10}}>
                  Borrow Price
                </Label>
                <Text>
                  IDR.
                  {formatRupiah(this.state.laboratory.borrowing_price + '')}
                </Text>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Form>
                  {this.state.freeTimeBooking.length != 0 && (
                    <Item
                      style={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}>
                      <Label>Free Time Booking</Label>
                      <Picker
                        selectedValue={this.state.selectedFreeTimeBooking}
                        onValueChange={selectedFreeTimeBooking => {
                          let {freeTimeBooking} = this.state;
                          let [startTime, endTime] =
                            freeTimeBooking[selectedFreeTimeBooking];

                          let dateTimeStartOrdering;
                          let dateTimeEndOrdering;

                          if (startTime != null) {
                            dateTimeStartOrdering = new Date(
                              startTime.replace(/-/g, '/'),
                            );
                          }
                          if (endTime != null) {
                            dateTimeEndOrdering = new Date(
                              endTime.replace(/-/g, '/'),
                            );
                          }

                          this.setState({
                            dateTimeStartOrdering,
                            dateTimeEndOrdering,
                            selectedFreeTimeBooking,
                          });
                        }}
                        style={{height: 50, width: '100%'}}>
                        {this.state.freeTimeBooking.map((item, index) => {
                          let startTime = item[0];
                          let endTime = item[1] ?? 'Next Free Time';
                          let value = `${startTime} - ${endTime}`;

                          return (
                            <Picker.Item
                              key={`select-${index}`}
                              label={value}
                              value={index}
                            />
                          );
                        })}
                      </Picker>
                    </Item>
                  )}

                  <DateTimeInput
                    value={this.state.dateTimeStartOrdering}
                    onChange={dateTimeStartOrdering =>
                      this.setState({dateTimeStartOrdering})
                    }
                    label="Date Start Borrow"
                    mode="date"
                  />
                  <DateTimeInput
                    value={this.state.dateTimeStartOrdering}
                    onChange={dateTimeStartOrdering =>
                      this.setState({dateTimeStartOrdering})
                    }
                    label="Time Start Borrow"
                    mode="time"
                  />
                  <TextError
                    text={this.state.invalidate.datetime_start_booking}
                    style={{marginLeft: 15}}
                  />

                  <DateTimeInput
                    value={this.state.dateTimeEndOrdering}
                    onChange={dateTimeEndOrdering =>
                      this.setState({dateTimeEndOrdering})
                    }
                    label="Date End Borrow"
                    mode="date"
                  />
                  <DateTimeInput
                    value={this.state.dateTimeEndOrdering}
                    onChange={dateTimeEndOrdering =>
                      this.setState({dateTimeEndOrdering})
                    }
                    label="Time End Borrow"
                    mode="time"
                  />
                  <TextError
                    text={this.state.invalidate.datetime_end_booking}
                    style={{marginLeft: 15}}
                  />
                </Form>
              </CardItem>
            </Card>
            <Card>
              <CardItem cardBody>
                <Form
                  style={{
                    alignItems: 'flex-start',
                    flex: 1,
                    paddingLeft: 10,
                    paddingRight: 30,
                    marginBottom: 20,
                  }}>
                  <Item floatingLabel>
                    <Label>Title Borrow</Label>
                    <Input
                      value={this.state.title}
                      onChangeText={title => this.setState({title})}
                      style={{marginVertical: 5}}
                    />
                  </Item>
                  <TextError
                    text={this.state.invalidate.title}
                    style={{marginLeft: 15}}
                  />

                  <Item floatingLabel>
                    <Label>Hal</Label>
                    <Input
                      value={this.state.hal}
                      onChangeText={hal => this.setState({hal})}
                      style={{marginVertical: 5}}
                    />
                  </Item>
                  <TextError
                    text={this.state.invalidate.hal}
                    style={{marginLeft: 15}}
                  />

                  <Item floatingLabel>
                    <Label>Supervisors Nip</Label>
                    <Input
                      value={this.state.supervisors_nip}
                      onChangeText={supervisors_nip =>
                        this.setState({supervisors_nip})
                      }
                      style={{marginVertical: 5}}
                    />
                  </Item>
                  <TextError
                    text={this.state.invalidate.supervisors_nip}
                    style={{marginLeft: 15}}
                  />

                  <Item floatingLabel>
                    <Label>Supervisors Name</Label>
                    <Input
                      value={this.state.supervisors_name}
                      onChangeText={supervisors_name =>
                        this.setState({supervisors_name})
                      }
                      style={{marginVertical: 5}}
                    />
                  </Item>
                  <TextError
                    text={this.state.invalidate.supervisors_name}
                    style={{marginLeft: 15}}
                  />

                  <Item floatingLabel>
                    <Label>Description Borrow</Label>
                    <Input
                      value={this.state.description}
                      onChangeText={description => this.setState({description})}
                      multiline
                      style={{marginVertical: 5}}
                    />
                  </Item>
                  <TextError
                    text={this.state.invalidate.description}
                    style={{marginLeft: 15}}
                  />
                </Form>
              </CardItem>
            </Card>
            <Card>
              <CardItem footer>
                <View style={{flex: 1}}>
                  <Button
                    onPress={this.onClickPaymentButton}
                    disabled={isLoading(this)}
                    style={{paddingHorizontal: 10}}>
                    {isLoading(this) && <Spinner size="small" color="white" />}
                    <Text>Save Update</Text>
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

EditBookingLaboratoryScreen.contextType = AppContext;

export default EditBookingLaboratoryScreen;
