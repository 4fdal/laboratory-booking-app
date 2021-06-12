import {
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Icon,
  Text,
  View,
} from 'native-base';
import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AppContext from '../../../app/context/AppContext';
import {blue, white} from '../../../config/colors';

class ProfileUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
    };
  }
  componentDidMount = () => {
    this.props.navigation.setOptions({
      headerRight: this.renderHeaderRight,
    });
  };
  renderHeaderRight = props => {
    return (
      <View style={{marginRight: 15, flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => this.setState({isEdit: !this.state.isEdit})}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="create-outline"
            type="Ionicons"
            style={{color: blue, fontSize: 24}}
          />
          <Text style={{fontSize: 14, color: blue}}>Edit</Text>
        </TouchableOpacity>
      </View>
    );
  };
  render = () => {
    return (
      <Container>
        <Content>
          <View style={{margin: 10, flexDirection: 'column', flex: 1}}>
            <Card>
              <CardItem></CardItem>
            </Card>
            <Card>
              <CardItem></CardItem>
            </Card>
            <Button full rounded style={{backgroundColor: blue, marginVertical: 30}}>
              <Icon
                name="log-out-outline"
                type="Ionicons"
                style={{color: white, fontSize: 24}}
              />
              <Text style={{color: white}}>Logout</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  };
}

ProfileUserScreen.contextType = AppContext;

export default ProfileUserScreen;
