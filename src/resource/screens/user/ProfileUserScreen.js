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
  Spinner,
  Text,
  Toast,
  View,
} from 'native-base';
import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AppContext from '../../../app/context/AppContext';
import {handleErrors} from '../../../app/helper/GlobalFunction';
import {RequestAuth} from '../../../app/helper/request/Request';
import {blue, white} from '../../../config/colors';
import TextError from '../../components/TextError';

class ProfileUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: true,
      nim: '',
      name: '',
      email: '',
      address: '',
      phoneNumber: '',
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
      invalidate: {
        nim: null,
        name: null,
        email: null,
        phone_number: null,
        old_password: null,
        new_password: null,
      },
      isLoading: false,
      isLoadingPassword: false,
    };
  }
  componentDidMount = async () => {
    await this.requestGetProfile();
    await this.props.navigation.setOptions({
      headerRight: this.renderHeaderRight,
    });
  };
  requestGetProfile = async () => {
    try {
      let req = await RequestAuth(this.props);
      let {
        data: {
          data: {
            user: {
              student_collage: {nim, address, phone_number},
              name,
              email,
            },
          },
        },
      } = await req.get('/v1/profile');

      this.setState({
        nim,
        name,
        email,
        phoneNumber: phone_number,
        address,
      });
    } catch (error) {
      handleErrors(this, error);
    }
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
  onClickButtonChangeProfile = async () => {
    this.setState({isLoading: true});
    try {
      let req = await RequestAuth(this.props);
      let {
        data: {
          data: {
            user: {
              student_collage: {nim, address, phone_number},
              name,
              email,
            },
          },
        },
      } = await req.put('/v1/profile/edit', {
        name: this.state.name,
        email: this.state.email,
        address: this.state.address,
        phone_number: this.state.phoneNumber,
      });

      this.setState({
        nim,
        name,
        email,
        phoneNumber: phone_number,
        address,
      });

      Toast.show({text: 'Success update profile', type: 'success'});
    } catch (error) {
      handleErrors(this, error);
    }
    this.setState({isLoading: false});
  };
  onClickButtonResetPassword = async () => {
    try {
      let req = await RequestAuth(this.props);

      let {
        data: {
          data: {message},
        },
      } = await req.put('/v1/profile/change-password', {
        old_password: this.state.oldPassword,
        new_password: this.state.newPassword,
        new_password_confirmation: this.state.newPasswordConfirmation,
      });

      Toast.show({text: message, type: 'success'});
    } catch (error) {
      handleErrors(this, error);
    }
  };
  render = () => {
    return (
      <Container>
        <Content>
          <View style={{margin: 10, flexDirection: 'column', flex: 1}}>
            <Card>
              <CardItem cardBody style={{marginBottom: 10}}>
                <Form style={{width: '95%'}}>
                  <Item floatingLabel>
                    <Label>Nim</Label>
                    <Input
                      value={this.state.nim}
                      onChangeText={nim => this.setState({nim})}
                      disabled={true}
                      style={{marginBottom: 10}}
                    />
                  </Item>
                  <TextError
                    text={this.state.invalidate.nim}
                    style={{marginLeft: 15}}
                  />
                  <Item floatingLabel>
                    <Label>Name</Label>
                    <Input
                      value={this.state.name}
                      onChangeText={name => this.setState({name})}
                      disabled={this.state.isEdit}
                      style={{marginBottom: 10}}
                    />
                  </Item>
                  <TextError
                    text={this.state.invalidate.name}
                    style={{marginLeft: 15}}
                  />
                  <Item floatingLabel>
                    <Label>Email</Label>
                    <Input
                      value={this.state.email}
                      onChangeText={email => this.setState({email})}
                      disabled={this.state.isEdit}
                      style={{marginBottom: 10}}
                    />
                  </Item>
                  <TextError
                    text={this.state.invalidate.email}
                    style={{marginLeft: 15}}
                  />
                  <Item floatingLabel>
                    <Label>Phone Number</Label>
                    <Input
                      value={this.state.phoneNumber}
                      onChangeText={phoneNumber => this.setState({phoneNumber})}
                      disabled={this.state.isEdit}
                      style={{marginBottom: 10}}
                    />
                  </Item>
                  <TextError
                    text={this.state.invalidate.phone_number}
                    style={{marginLeft: 15}}
                  />
                  <Item floatingLabel>
                    <Label>Address</Label>
                    <Input
                      multiline
                      value={this.state.address}
                      onChangeText={address => this.setState({address})}
                      disabled={this.state.isEdit}
                      style={{marginBottom: 10}}
                    />
                    <TextError
                      text={this.state.invalidate.address}
                      style={{marginLeft: 15}}
                    />
                  </Item>
                </Form>
              </CardItem>
              <CardItem footer>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Button
                    onPress={this.onClickButtonChangeProfile}
                    disabled={this.state.isEdit || this.state.isLoading}
                    full
                    rounded>
                    {this.state.isLoading && (
                      <Spinner size="small" color="white" />
                    )}
                    <Text>Change Profile</Text>
                  </Button>
                </View>
              </CardItem>
            </Card>
            <Card>
              <CardItem header>
                <Text>
                  Note: Leave it blank if you don't want to change the password{' '}
                </Text>
              </CardItem>
              <CardItem cardBody>
                <Form style={{width: '95%'}}>
                  <Item floatingLabel>
                    <Label>Old Password</Label>
                    <Input
                      onChangeText={oldPassword => this.setState({oldPassword})}
                      secureTextEntry={true}
                      disabled={this.state.isEdit}
                      style={{marginBottom: 10}}
                    />
                  </Item>
                  <TextError
                    text={this.state.invalidate.old_password}
                    style={{marginLeft: 15}}
                  />
                  <Item floatingLabel>
                    <Label>New Password</Label>
                    <Input
                      onChangeText={newPassword => this.setState({newPassword})}
                      secureTextEntry={true}
                      disabled={this.state.isEdit}
                      style={{marginBottom: 10}}
                    />
                  </Item>
                  <TextError
                    text={this.state.invalidate.new_password}
                    style={{marginLeft: 15}}
                  />
                  <Item floatingLabel>
                    <Label>New Password Confirmation</Label>
                    <Input
                      onChangeText={newPasswordConfirmation =>
                        this.setState({newPasswordConfirmation})
                      }
                      secureTextEntry={true}
                      disabled={this.state.isEdit}
                      style={{marginBottom: 10}}
                    />
                  </Item>
                </Form>
              </CardItem>
              <CardItem footer>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Button
                    onPress={this.onClickButtonResetPassword}
                    disabled={this.state.isEdit || this.state.isLoadingPassword}
                    full
                    rounded>
                    {this.state.isLoadingPassword && (
                      <Spinner color={white} size="large" />
                    )}
                    <Text>Change Password</Text>
                  </Button>
                </View>
              </CardItem>
            </Card>
            <Button
              full
              rounded
              style={{backgroundColor: blue, marginVertical: 30}}>
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
