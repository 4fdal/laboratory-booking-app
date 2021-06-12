import React, {Component} from 'react';
import AppContext from '../../../app/context/AppContext';
import {Dimensions, PermissionsAndroid, StyleSheet, View} from 'react-native';
import Pdf from 'react-native-pdf';
import {Icon, Toast} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {blue} from '../../../config/colors';
import RNFetchBlob from 'rn-fetch-blob';

class PDFScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlPDF: this.props?.route?.params?.urlPDF,
    };
  }
  componentDidMount = () => {
    this.props.navigation.setOptions({
      headerRight: this.renderHeaderRight,
    });
  };
  onClickDownloadDocumentReport = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'App External Storage Permission',
          message: 'App needs access to your external storage ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        let downloadPDFReport = await RNFetchBlob.config({
          fileCache: true,
          addAndroidDownloads: {
            notification: true,
            mime: 'application/pdf',
            mediaScannable: true,
            path: `${RNFetchBlob.fs.dirs.DownloadDir}/${
              new Date().getTime() + Math.random().toString().slice(2)
            }.pdf`,
            useDownloadManager: true,
          },
        }).fetch('GET', this.state.urlPDF);

        Toast.show({
          text: 'PDF document report download success',
          type: 'success',
        });
      } else {
        console.log('External storage permission denied');
      }
    } catch (error) {
      console.log('[error] ViewChartScreen._onPressIconDownload ', error);
    }
  };
  renderHeaderRight = props => {
    return (
      <TouchableOpacity
        onPress={this.onClickDownloadDocumentReport}
        style={{marginRight: 10}}>
        <Icon style={{color: blue}} type="Ionicons" name="download-outline" />
      </TouchableOpacity>
    );
  };
  render = () => {
    return (
      <View style={styles.container}>
        <Pdf
          source={{uri: this.state.urlPDF}}
          onLoadComplete={(numberOfPages, filePath) => {}}
          onPageChanged={(page, numberOfPages) => {}}
          onError={error => {
            Toast.show({text: error.message, type: 'danger'});
          }}
          onPressLink={uri => {}}
          style={styles.pdf}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

PDFScreen.contextType = AppContext;

export default PDFScreen;
