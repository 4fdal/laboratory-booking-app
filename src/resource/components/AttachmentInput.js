import React, {Component} from 'react';
import {
  Accordion,
  Button,
  Card,
  Form,
  Icon,
  Input,
  Item,
  Label,
  Text,
  View,
} from 'native-base';
import {FlatList, Modal, ScrollView, TouchableOpacity} from 'react-native';
import AppContext from '../../app/context/AppContext';

class AttachmentInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: true,
      typeUse: [],
      nameTool: '',
      fragments: [],
    };
  }
  render = () => {
    return (
      <View>
        <ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isShowModal}>
            <View
              style={{
                flex: 1,
                padding: 10,
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <Card style={{margin: 10}}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    marginRight: 10,
                    marginTop: 5,
                  }}>
                  <Icon
                    name="close-outline"
                    onPress={() => {
                      this.setState({
                        typeUse: [],
                        nameTool: '',
                        isShowModal: false,
                      });
                    }}
                  />
                </View>
                <Form style={{marginVertical: 20, marginRight: 20}}>
                  <Item floatingLabel>
                    <Label>Tools Name</Label>
                    <Input
                      onChangeText={nameTool => this.setState({nameTool})}
                      style={{marginBottom: 5}}
                    />
                  </Item>
                  <FlatList
                    data={this.state.typeUse}
                    renderItem={({index, item}) => (
                      <Item floatingLabel>
                        <Label>Type of Use/Test</Label>
                        <Input
                          onChangeText={typeUseInput => {
                            let {typeUse} = this.state;
                            typeUse[index] = typeUseInput;

                            this.setState({typeUse});
                          }}
                          style={{marginBottom: 5}}
                        />
                        <Icon
                          name="close-outline"
                          onPress={() => {
                            let {typeUse} = this.state;

                            typeUse = typeUse.slice(index, 1)

                            this.setState({typeUse});
                          }}
                        />
                      </Item>
                    )}
                  />
                  <Button
                    onPress={() => {
                      let {typeUse} = this.state;
                      typeUse.push('');
                      this.setState({typeUse: typeUse});
                    }}
                    style={{marginLeft: 15, marginTop: 10}}>
                    <Icon name="add-outline" />
                  </Button>
                </Form>

                <Button full>
                  <Text>Save</Text>
                </Button>
              </Card>
            </View>
          </Modal>
        </ScrollView>
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
          <Accordion
            style={{width: '90%'}}
            dataArray={[
              {title: 'First Element', content: 'Lorem ipsum dolor sit amet'},
            ]}
            expanded={0}
          />
        </View>
      </View>
    );
  };
}

AttachmentInput.contextType = AppContext;

export default AttachmentInput;
