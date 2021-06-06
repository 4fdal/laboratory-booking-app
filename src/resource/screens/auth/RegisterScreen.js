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
  Radio,
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

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.statusIdentity = [
      {key: 'college_student', value: 'Students Collage', identityCard: 'nim'},
      {key: 'another_borrower', value: 'General Person', identityCard: 'nik'},
    ];
    this.state = {
      isLoading: false,
      statusRegister: this.statusIdentity[0].key,
      identityNumber: '',
      email: '',
      address: '',
      password: '',
      passwordConfirmation: '',
      name: '',
      identityCard: this.statusIdentity[0].identityCard,
      invalidate: {
        email: '',
        address: '',
        password: '',
        password_confirmation: '',
        nik: '',
        nim: '',
        name: '',
      },
    };
  }
  onClickButtonRegister = async () => {
    this.setState({isLoading: true});
    this.setState({
      invalidate: {
        email: '',
        address: '',
        password: '',
        password_confirmation: '',
        nik: '',
        nim: '',
      },
    });
    try {
      let {
        name,
        address,
        email,
        identityCard,
        password,
        passwordConfirmation,
        statusRegister,
        identityNumber,
      } = this.state;
      let dataRequest = {
        name,
        address,
        email,
        password,
        [identityCard]: identityNumber,
        status_register: statusRegister,
        password_confirmation: passwordConfirmation,
      };

      let {
        data: {
          data: {users},
        },
      } = await Request.post('/v1/auth/register', dataRequest);
      return this.props.navigation.replace('UserVerificationScreen', {
        users,
        from: 'register',
      });
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
    let {invalidate} = this.state;
    return (
      <Container>
        <Content style={{padding: 10}}>
          <Card>
            <CardItem header>
              <Text style={{fontSize: 20}}>Register Account</Text>
            </CardItem>
            <CardItem cardBody>
              <Form style={{width: '95%'}}>
                <View style={{marginLeft: 15}}>
                  <Label style={{marginBottom: 10}}>Status Register</Label>
                  <Row>
                    {this.statusIdentity.map(
                      ({key, value, identityCard}, index) => (
                        <Row key={`radio-${index}`}>
                          <Radio
                            color="black"
                            onPress={() =>
                              this.setState({statusRegister: key, identityCard})
                            }
                            selected={this.state.statusRegister === key}
                          />
                          <Text style={{marginLeft: 5}}>{value}</Text>
                        </Row>
                      ),
                    )}
                  </Row>
                </View>
                <Item floatingLabel>
                  <Label>Name</Label>
                  <Input
                    defaultValue={this.state.name}
                    onChangeText={name =>
                      this.setState({name})
                    }
                    style={{margin: 10}}
                  />
                </Item>
                <TextError
                  style={{marginLeft: 15}}
                  text={invalidate.name}
                />
                <Item floatingLabel>
                  <Label>Identity Number (NIK/KTP)</Label>
                  <Input
                    defaultValue={this.state.identityNumber}
                    onChangeText={identityNumber =>
                      this.setState({identityNumber})
                    }
                    style={{margin: 10}}
                  />
                </Item>
                <TextError
                  style={{marginLeft: 15}}
                  text={invalidate.nim || invalidate.nip}
                />
                <Item floatingLabel>
                  <Label>Email</Label>
                  <Input
                    defaultValue={this.state.email}
                    onChangeText={email => this.setState({email})}
                    style={{margin: 10}}
                  />
                </Item>
                <TextError style={{marginLeft: 15}} text={invalidate.email} />
                <Item floatingLabel>
                  <Label>Address</Label>
                  <Input
                    defaultValue={this.state.address}
                    onChangeText={address => this.setState({address})}
                    style={{margin: 10}}
                  />
                </Item>
                <TextError style={{marginLeft: 15}} text={invalidate.address} />
                <Item floatingLabel>
                  <Label>Password</Label>
                  <Input
                    secureTextEntry={true}
                    defaultValue={this.state.password}
                    onChangeText={password => this.setState({password})}
                    style={{margin: 10}}
                  />
                </Item>
                <TextError
                  style={{marginLeft: 15}}
                  text={invalidate.password}
                />
                <Item floatingLabel>
                  <Label>Password Confirmation</Label>
                  <Input
                    secureTextEntry={true}
                    defaultValue={this.state.passwordConfirmation}
                    onChangeText={passwordConfirmation =>
                      this.setState({passwordConfirmation})
                    }
                    style={{margin: 10}}
                  />
                </Item>
              </Form>
            </CardItem>
            <CardItem footer>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <Button
                  disabled={this.state.isLoading}
                  full
                  onPress={this.onClickButtonRegister}>
                  {this.state.isLoading && (
                    <Spinner size="small" color="primary" />
                  )}
                  <Text>Register</Text>
                </Button>
                <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
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

RegisterScreen.contextType = AppContext;

export default RegisterScreen;
