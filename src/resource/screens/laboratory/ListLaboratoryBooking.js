import {
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Icon,
  Label,
  List,
  Spinner,
  Text,
  View,
} from 'native-base';
import React, { Component } from 'react';
import AppContext from '../../../app/context/AppContext';
import { formatRupiah, handleErrors } from '../../../app/helper/GlobalFunction';
import { Request } from '../../../app/helper/request/Request';
import { Image } from 'react-native';
import { blue } from '../../../config/colors';

class ListLaboratoryBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      laboratory: [],
      isLoading: false,
    };
  }
  componentDidMount = () => {
    this.LaboratoryRequest();
  };
  LaboratoryRequest = async () => {
    this.setState({ isLoading: true });
    try {
      let {
        data: { data },
      } = await Request.get('/v1/data/labor');
      this.setState({ laboratory: data });
    } catch (error) {
      handleErrors(this, error);
    }
    this.setState({ isLoading: false });
  };
  onClickButtonBookingNow = laboratory => () => {
    this.props.navigation.navigate('FormBookingLaboratoryScreen', {
      laboratory
    });
  };
  render = () => {
    let { laboratory } = this.state;

    return (
      <Container>
        <Content>
          {this.state.isLoading && <Spinner size="small" />}
          <View style={{ margin: 10, flex: 1 }}>
            <List>
              {laboratory
                .filter(labor => labor.active_status)
                .map((labor, index) => {
                  return (
                    <Card key={`card-laboratory-${index}`}>
                      <CardItem header bordered>
                        <Text>{labor.name}</Text>
                      </CardItem>
                      <CardItem>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                          <Card
                            style={{
                              padding: 10,
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Icon
                              name="time-outline"
                              type="Ionicons"
                              style={{ color: blue }}
                            />
                            <View style={{ marginLeft: 10 }}>
                              <Label>Time Start Borrowing</Label>
                              <Text style={{ color: blue }}>
                                {labor.schedule_start_enter_labor}
                              </Text>
                            </View>
                          </Card>
                          <Card
                            style={{
                              padding: 10,
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text style={{ color: blue, fontWeight: 'bold' }}>
                              IDR.
                            </Text>

                            <View style={{ marginLeft: 10 }}>
                              <Label>Price Borrowing</Label>
                              <Text style={{ color: blue }}>
                                {formatRupiah(labor.borrowing_price)}
                              </Text>
                            </View>
                          </Card>
                        </View>
                      </CardItem>
                      <CardItem footer>
                        <View style={{ flex: 1 }}>
                          <Button onPress={this.onClickButtonBookingNow(labor)}>
                            <Icon name="add-outline" type="Ionicons" />
                            <Text>Booking Now</Text>
                          </Button>
                        </View>
                      </CardItem>
                    </Card>
                  );
                })}
            </List>
          </View>
        </Content>
      </Container>
    );
  };
}

ListLaboratoryBooking.contextType = AppContext;

export default ListLaboratoryBooking;
