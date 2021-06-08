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
  Text,
  View,
} from 'native-base';
import React, { Component } from 'react';
import AppContext from '../../../app/context/AppContext';
import { blue, indigo } from '../../../config/colors';
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
      title: '',
      description: '',
      showDateTimeStartOrder: true
    };
  }
  componentDidMount = () => {
    if (this.props.route.params) {
      let { laboratoryId } = this.props.route.params;
      this.setState({ laboratoryId });
    }
  };
  onDateChangeTime = (stateName) => ({ nativeEvent: { timestamp } }) => {
    if (timestamp) {

    }
  }
  render = () => {
    return (
      <Container>
        <Content>
          <View style={{ margin: 10, flex: 1 }}>
            <Card>
              <CardItem cardBody>
                <Form style={{ width: '95%' }}>
                  <Item floatingLabel>
                    <Label>Title Borrow</Label>
                    <Input style={{ marginVertical: 5 }} />
                  </Item>
                  <DateTimeInput />
                  <Item floatingLabel>
                    <Label>Description Borrow</Label>
                    <Input multiline style={{ marginVertical: 5 }} />
                  </Item>
                </Form>
              </CardItem>
              <CardItem footer>
                <View style={{ flex: 1, marginTop: 10 }}>
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
