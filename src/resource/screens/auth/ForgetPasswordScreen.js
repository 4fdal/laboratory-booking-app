import {
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Form,
  Input,
  Item,
  Label,
  Row,
  Spinner,
  Text,
  Toast,
  View,
} from 'native-base';
import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import AppContext from '../../../app/context/AppContext';
import AxiosErrors from '../../../app/helper/request/AxiosErrors';
import {Request} from '../../../app/helper/request/Request';
import TextError from '../../components/TextError';

class ForgetPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      invalidate: {
        email: null,
      },
      isLoading: false,
    };
  }
  onClickButtonForgetPassword = async () => {
    this.setState({isLoading: true});
    try {
      let {email} = this.state;
      await Request.post('/v1/auth/forget_password', {email});
      this.props.navigation.navigate('ResetPasswordScreen');
    } catch (error) {
      console.log(error)
      if (error.status == 422) {
        this.setState({
          invalidate: AxiosErrors.copyErrorsToStringObject(
            error,
            this.state.invalidate,
          ),
        });
      } else {
        Toast.show({text: error.message, type: 'danger'});
      }
    }
    this.setState({isLoading: false});
  };
  render = () => {
    return (
      <Container>
        <Content style={{padding: 10}}>
          <Card>
            <CardItem header bordered>
              <Text>
                If your forget password account, fill email form for get token
                change password account
              </Text>
            </CardItem>
            <CardItem cardBody>
              <Form style={{width: '95%'}}>
                <Item floatingLabel>
                  <Label>Email Account</Label>
                  <Input
                    defaultValue={this.state.email}
                    onChangeText={email => this.setState({email})}
                    style={{marginTop: 10}}
                  />
                </Item>
                <TextError
                  style={{marginLeft: 15}}
                  text={this.state.invalidate.email}
                />
              </Form>
            </CardItem>
            <CardItem footer>
              <View style={{marginTop: 5, flex: 1, flexDirection: 'column'}}>
                <Button
                  disabled={this.state.isLoading}
                  full
                  onPress={this.onClickButtonForgetPassword}>
                  {this.state.isLoading && (
                    <Spinner size="small" color="primary" />
                  )}
                  <Text>Forget Password</Text>
                </Button>
                <View style={{marginTop: 10}}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('LoginScreen')
                    }>
                    <Text style={{fontWeight: 'bold'}}>Login Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  };
}

ForgetPasswordScreen.contextType = AppContext;

export default ForgetPasswordScreen;
