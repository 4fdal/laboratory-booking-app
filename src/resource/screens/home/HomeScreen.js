import { Container, Content } from 'native-base';
import React, {Component} from 'react';
import AppContext from '../../../app/context/AppContext';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render = () => {
    return <Container>
      <Content style={{ padding : 10 }}>
        
      </Content>
    </Container>;
  };
}

HomeScreen.contextType = AppContext;

export default HomeScreen;
