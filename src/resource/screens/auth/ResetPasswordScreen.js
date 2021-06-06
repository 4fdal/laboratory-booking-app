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
import React, {Component} from 'react';
import AppContext from '../../../app/context/AppContext';
import AxiosErrors from '../../../app/helper/request/AxiosErrors';
import {Request} from '../../../app/helper/request/Request';
import TextError from '../../components/TextError';

class ResetPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      password: '',
      password_confirmation: '',
      invalidate: {
        token: null,
        password: null,
      },
      isLoading: false,
    };
  }
  onClickButtonResetPassword = async () => {
    this.setState({isLoading: true});
    try {
      let {token, password, password_confirmation} = this.state;
      await Request.post('/v1/auth/reset_password', {
        token,
        password,
        password_confirmation,
      });
      Toast.show({text: 'Password success to changed'});
      this.props.navigation.replace('LoginScreen');
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
  render = () => {
    return (
      <Container>
        <Content style={{padding: 10}}>
          <Card>
            <CardItem header bordered>
              <Text>
                Check your email for token reset password, and fill token value
                in form
              </Text>
            </CardItem>
            <CardItem cardBody>
              <Form style={{width: '95%'}}>
                <Item floatingLabel>
                  <Label>Reset Password Token </Label>
                  <Input
                    defaultValue={this.state.token}
                    onChangeText={token => this.setState({token})}
                    style={{marginBottom: 10}}
                  />
                </Item>
                <TextError
                  style={{marginLeft: 15}}
                  text={this.state.invalidate.token}
                />
                <Item floatingLabel>
                  <Label>Password</Label>
                  <Input
                    secureTextEntry={true}
                    defaultValue={this.state.password}
                    onChangeText={password => this.setState({password})}
                    style={{marginBottom: 10}}
                  />
                </Item>
                <TextError
                  style={{marginLeft: 15}}
                  text={this.state.invalidate.password}
                />
                <Item floatingLabel>
                  <Label>Password Confirmation</Label>
                  <Input
                    secureTextEntry={true}
                    defaultValue={this.state.password_confirmation}
                    onChangeText={password_confirmation =>
                      this.setState({password_confirmation})
                    }
                    style={{marginBottom: 10}}
                  />
                </Item>
              </Form>
            </CardItem>
            <CardItem footer>
              <View style={{marginVertical: 10, flex: 1}}>
                <Button
                  onPress={this.onClickButtonResetPassword}
                  full
                  disabled={this.state.isLoading}>
                  {this.state.isLoading && (
                    <Spinner color="primary" size="small" />
                  )}
                  <Text>Reset Password</Text>
                </Button>
              </View>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  };
}

ResetPasswordScreen.contextType = AppContext;

export default ResetPasswordScreen;
