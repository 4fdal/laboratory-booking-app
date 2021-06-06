import {Container, Content, Toast} from 'native-base';
import React, {Component} from 'react';
import AppContext from '../../../app/context/AppContext';
import {redirectResetTo} from '../../../app/helper/GlobalFunction';
import {Request, RequestAuth} from '../../../app/helper/request/Request';

class UserLaboratoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {
    this.getUserLaboratory();
  };
  getUserLaboratory = async () => {
    try {
      let request = await RequestAuth(this.props);
      let {data} = await request.get('/v1/laboratory'); 
    } catch (error) {
      if (error.status == 401) {
        redirectResetTo(this.props, 'LoginScreen');
      }
      Toast.show({text: error.message, type: 'danger'});
    }
  };
  render = () => {
    return (
      <Container>
        <Content></Content>
      </Container>
    );
  };
}

UserLaboratoryScreen.contextType = AppContext;

export default UserLaboratoryScreen;
