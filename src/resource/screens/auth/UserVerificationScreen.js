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
import {blue} from '../../../config/colors';
import TextError from '../../components/TextError';

class UserVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'afdalmtk@gmail.com',
      name: 'example',
      verificationTokenCount: 0,
      token: '',
      isLoading: false,
      invalidate: {
        token: null,
      },
      from: 'register',
    };
  }
  componentDidMount = () => {
    let {params} = this.props.route;
    if (params) {
      if (params.users) {
        let {email, name} = params.users;
        let {from} = params;
        this.setState({email, name, from});
      }
    }
  };
  onClickButtonVerificationAccount = async () => {
    this.setState({isLoading: true});
    try {
      let {token, email, from} = this.state;
      await Request.post('/v1/auth/register_verification', {
        token,
        email,
      });
      Toast.show({text: 'Congratulated, verification account success!'});
      if (from === 'register') {
        this.props.navigation.replace('LoginScreen');
      } else {
        this.props.navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      }
    } catch (error) {
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
  onTouchResendVerificationCodeText = async () => {
    this.setState({verificationTokenCount: 60});
    let timeInterval = setInterval(() => {
      let verificationTokenCount = this.state.verificationTokenCount - 1;
      this.setState({verificationTokenCount});

      if (verificationTokenCount <= 0) {
        clearInterval(timeInterval);
      }
    }, 1000);
    if (this.state.verificationTokenCount == 0) {
      try {
        await Request.post('/v1/auth/resend_verification_code', {
          email: this.state.email,
        });
      } catch (error) {
        Toast.show({text: error.message, type: 'danger'});
      }
    }
  };
  render = () => {
    return (
      <Container>
        <Content style={{padding: 10}}>
          <Card>
            <CardItem header>
              <Text>
                Account with name {this.state.name} and email {this.state.email}{' '}
                not yet verification
              </Text>
            </CardItem>
            <CardItem cardBody>
              <Form style={{flex: 1, marginHorizontal: 10}}>
                <Item style={{width: '40%'}} floatingLabel>
                  <Label>Code Verification</Label>
                  <Input
                    defaultValue={this.state.token}
                    onChangeText={token => this.setState({token})}
                    style={{marginTop: 10}}
                  />
                </Item>
                <TextError
                  style={{marginLeft: 15, width: '90%'}}
                  text={this.state.invalidate.token}
                />
                <View style={{marginLeft: 15}}>
                  <TouchableOpacity
                    disabled={this.state.verificationTokenCount != 0}
                    onPress={this.onTouchResendVerificationCodeText}>
                    <Text style={{fontSize: 14, color: blue}}>
                      {this.state.verificationTokenCount == 0
                        ? 'Resend Verification Code'
                        : `Please wait ${this.state.verificationTokenCount} seconde`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Form>
            </CardItem>
            <CardItem footer>
              <View style={{flexDirection: 'column'}}>
                <Text>
                  Please verification your account, with fill code verification!
                </Text>
                <View style={{marginTop: 10}}>
                  <Button
                    rounded
                    disabled={this.state.isLoading}
                    onPress={this.onClickButtonVerificationAccount}>
                    {this.state.isLoading && (
                      <Spinner size="small" color="primary" />
                    )}
                    <Text>Verification Account</Text>
                  </Button>
                </View>
              </View>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  };
}

UserVerification.contextType = AppContext;

export default UserVerification;
