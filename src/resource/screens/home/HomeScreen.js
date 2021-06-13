import {Observer} from 'mobx-react-lite';
import {Card, Container, Content, Text, View} from 'native-base';
import React, {Component} from 'react';
import AppContext from '../../../app/context/AppContext';
import {formatDate, handleErrors} from '../../../app/helper/GlobalFunction';
import {
  getCache,
  setDataCache,
  setDataCacheSpecific,
} from '../../../app/helper/MobxFunction';
import {RequestAuth} from '../../../app/helper/request/Request';
import {Agenda} from 'react-native-calendars';
import {blue} from '../../../config/colors';
import {StyleSheet} from 'react-native';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schedule: {},
    };
  }
  componentDidMount = () => {
    this.requestGetConfig();
    this.requestGetScheduleLaboratory();
  };
  requestGetScheduleLaboratory = async () => {
    try {
      let req = await RequestAuth(this.props);
      let {
        data: {
          data: {schedule},
        },
      } = await req.get('/v1/laboratory/booking');

      this.setState({schedule});
    } catch (error) {
      handleErrors(error);
    }
  };
  requestGetConfig = async () => {
    try {
      let req = await RequestAuth(this.props);
      let {
        data: {
          data: {config},
        },
      } = await req.get('/v1/config');

      setDataCache(this, {
        config,
      });
    } catch (error) {
      handleErrors(error);
    }
  };
  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
  renderObserver = () => {
    return (
      <Agenda
        selected={formatDate(new Date())}
        items={this.state.schedule}
        renderItem={item => {
          console.log(item);
          return (
            <Card elevation={10} style={styles.item}>
              <View style={styles.viewItemAgenda}>
                <View style={styles.viewItemAgendaTextGroup}>
                  <Text style={styles.textLaboratory}>{item.status}</Text>
                  <Text style={styles.textTime}>{item.date}</Text>
                  <Text style={styles.textTime}>{item.time}</Text>
                  <View style={{marginTop: 10, flexDirection: 'column'}}>
                    <Text style={{fontSize: 12}}>Laboratory</Text>
                    <Text style={{fontSize: 14}}>{item.laboratory}</Text>
                  </View>
                </View>
                <View style={styles.viewItemAgendaAvatarGroup}></View>
              </View>
            </Card>
          );
        }}
      />
    );
  };
  render = () => {
    return <Observer>{this.renderObserver}</Observer>;
  };
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  viewItemAgenda: {
    flex: 1,
    flexDirection: 'row',
  },
  viewItemAgendaTextGroup: {
    flex: 4,
  },
  viewItemAgendaAvatarGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLaboratory: {
    color: blue,
  },
  textTime: {
    color: blue,
    fontSize: 14,
  },
  textName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textTitle: {
    fontSize: 12,
  },
});

HomeScreen.contextType = AppContext;

export default HomeScreen;
