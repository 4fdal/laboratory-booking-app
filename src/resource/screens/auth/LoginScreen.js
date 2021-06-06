import React, {Component} from 'react';
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
  Spinner,
  Text,
  Toast,
  View,
} from 'native-base';
import {TouchableOpacity} from 'react-native';
import AxiosErrors from '../../../app/helper/request/AxiosErrors';
import TextError from '../../components/TextError';
import {Request} from '../../../app/helper/request/Request';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { keyTokenSaveLocalStorage } from '../../../config/app';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      invalidate: {
        email: null,
        password: null,
      },
      isLoading: false,
    };
  }
  onClickButtonLogin = async () => {
    this.setState({isLoading: true});
    try {
      let {email, password} = this.state;
      let {
        data: {
          data: {
            auth: {access_token},
            user,
          },
        },
      } = await Request.post('/v1/auth/login', {email, password});

      AsyncStorage.setItem(keyTokenSaveLocalStorage, access_token);

      let {active_account} = user;

      if (active_account) {
        this.props.navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      } else {
        this.props.navigation.navigate('UserVerificationScreen', {
          users: user,
          from: 'login',
        });
      }
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
        <Content style={{ padding : 10 }}>
          <Card>
            <CardItem header bordered>
              <Text style={{fontSize: 20}}>Login</Text>
            </CardItem>
            <CardItem cardBody>
              <Form style={{width: '95%'}}>
                <Item floatingLabel>
                  <Label>Email</Label>
                  <Input
                    defaultValue={this.state.email}
                    onChangeText={email => this.setState({email})}
                    style={{margin: 5}}
                  />
                </Item>
                <TextError
                  text={this.state.invalidate.email}
                  style={{marginLeft: 15}}
                />
                <Item floatingLabel>
                  <Label>Password</Label>
                  <Input
                    secureTextEntry={true}
                    defaultValue={this.state.password}
                    onChangeText={password => this.setState({password})}
                    textContentType="password"
                    style={{margin: 5}}
                  />
                </Item>
                <TextError
                  text={this.state.invalidate.password}
                  style={{marginLeft: 15}}
                />
              </Form>
            </CardItem>
            <CardItem footer>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <Button
                  disabled={this.state.isLoading}
                  full
                  onPress={this.onClickButtonLogin}>
                  {this.state.isLoading && (
                    <Spinner size="small" color="primary" />
                  )}
                  <Text>Login</Text>
                </Button>
                <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('RegisterScreen')
                    }>
                    <Text style={{fontWeight: 'bold'}}>Register Account</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgetPasswordScreen')} style={{alignItems: 'flex-end', flex: 1}}>
                    <Text>Lupa Password?</Text>
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

// LoginScreen.contextType = AppContext;

export default LoginScreen;
