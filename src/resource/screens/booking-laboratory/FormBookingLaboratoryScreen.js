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
  Spinner,
  Text,
  Toast,
  View,
} from 'native-base';
import React, {Component} from 'react';
import {Picker} from 'react-native';
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
import DateTimeInput from '../../components/DateTimeInput';
import TextError from '../../components/TextError';

class FormBookingLaboratoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      laboratory: {},
      dateTimeStartOrdering: new Date(),
      dateTimeEndOrdering: new Date(),
      title: '',
      description: '',
      invalidate: {
        datetime_start_booking: null,
        datetime_end_booking: null,
        title: null,
        description: null,
      },
      freeTimeBooking: [],
      selectedFreeTimeBooking: '',
    };
  }
  componentDidMount = async () => {
    await this.requestGetFreeTimeBooking();
    if (this.props.route.params) {
      let {laboratory} = this.props.route.params;
      this.setState({laboratory});
    }
  };
  requestGetFreeTimeBooking = async () => {
    try {
      let request = await RequestAuth(this.props);
      let {
        data: {
          data: {free_booking_time},
        },
      } = await request.get('/v1/laboratory/booking/free_booking_time');

      if (free_booking_time[0]) {
        let [startTime, endTime] = free_booking_time[0];

        let dateTimeStartOrdering = new Date(startTime.replace(/-/g, '/'));
        let dateTimeEndOrdering = new Date(endTime.replace(/-/g, '/'));

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
      let {
        dateTimeEndOrdering,
        dateTimeStartOrdering,
        title,
        description,
        laboratory: {id},
      } = this.state;
      let dataRequest = {
        labor_id: id,
        title,
        description,
        datetime_start_booking: formatDateTime(dateTimeStartOrdering),
        datetime_end_booking: formatDateTime(dateTimeEndOrdering),
      };

      let request = await RequestAuth(this.props);
      let data = await request.post(
        '/v1/laboratory/booking/plea_submission',
        dataRequest,
      );
    } catch (error) {
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
                <Text>{this.state.laboratory.name}</Text>

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
              <CardItem cardBody>
                <Form style={{width: '95%'}}>
                  <Item floatingLabel>
                    <Label>Title Borrow</Label>
                    <Input
                      onChangeText={title => this.setState({title})}
                      style={{marginVertical: 5}}
                    />
                  </Item>
                  <TextError
                    text={this.state.invalidate.title}
                    style={{marginLeft: 15}}
                  />

                  <Item
                    style={{flexDirection: 'column', alignItems: 'flex-start'}}>
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

                  <Item floatingLabel>
                    <Label>Description Borrow</Label>
                    <Input
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
              <CardItem footer>
                <View style={{flex: 1, marginTop: 10}}>
                  <Button
                    onPress={this.onClickPaymentButton}
                    disabled={isLoading(this)}
                    style={{paddingHorizontal: 10}}>
                    {isLoading(this) && <Spinner size="small" color="white" />}
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
  render = () => {
    return <Observer>{this.renderObserver}</Observer>;
  };
}

FormBookingLaboratoryScreen.contextType = AppContext;

export default FormBookingLaboratoryScreen;
