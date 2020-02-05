import React, {Component} from 'react';
import {View, ScrollView, ImageBackground, AsyncStorage} from 'react-native';
import data from './models/data';
import Channels from './components/channels';
import styles from './components/css/style-main';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      sources: null,
      navigateResumeData: null,
    };
    this.getData = this.getData.bind(this);
    this.storeData = this.storeData.bind(this);
  }
  componentDidMount() {
    console.log('Main Mounted');
    this.reloadHandler();
  }
  componentWillUnmount() {
    console.log('Main unmount');
    this._refreshScreen.remove();
  }

  /**
   * Reload screen and update data when DidFocus
   */
  reloadHandler = () => {
    this.setState({
      sources: data,
    });
    this._refreshScreen = this.props.navigation.addListener('didFocus', () => {
      // console.log('reload screen and update data');
      // console.log('state from parent: ', this.state);
      // console.log('Props from parent:', this.props);
      this.setState({
        sources: data,
      });
    });
  };

  /**
   * Channels onClick handler
   */
  handleClick = async channels => {
    const {navigation} = this.props;
    await this.getData(channels.id).then(dt =>
      this.setState({navigateResumeData: dt}),
    );
    // console.log('handleClick: ', this.state.navigateResumeData);
    // console.log(this.getData(channels.id));
    navigation.navigate('Player', {
      channels: channels,
      resumeData: this.state.navigateResumeData,
      returnData: this.returnData.bind(this),
    });
  };

  /**
   * Catch and setstate for data received from child components
   * @param {*} videoIndex
   * @param {*} currentTime
   * @param {*} videoID
   */
  returnData = (channelID, channelName, videoIndex, currentTime, videoID) => {
    // console.log(videoID + ' ------- ' + videoIndex + ' ----- ' + currentTime);
    this.setState({
      resumeData: {channelID, channelName, videoIndex, currentTime, videoID},
    });
    this.storeData();
  };

  storeData = async () => {
    try {
      // console.log('store data: ');
      await AsyncStorage.setItem(
        this.state.resumeData.channelID.toString(),
        JSON.stringify(this.state.resumeData),
      );
    } catch (e) {
      // saving error
      console.log('saveData error: ', e);
    }
  };
  getData = async channelID => {
    try {
      const value = await AsyncStorage.getItem(channelID.toString());
      if (value !== null) {
        // console.log('data from storage: ', JSON.parse(value));
        return JSON.parse(value);
      }
    } catch (e) {
      // error reading value
      console.log('getData error: ', e);
    }
  };
  render() {
    // console.log(this.props);
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.imgbackground}
          source={{
            uri:
              'https://wpamelia.com/wp-content/uploads/2019/02/astronomy-constellation-dark-998641.jpg',
          }}>
          <ScrollView
            style={styles.scrollViewContainer}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal>
              {this.state.sources &&
                this.state.sources.map(channels => (
                  <TouchableOpacity
                    key={channels.id}
                    onPress={() => this.handleClick(channels)}>
                    <Channels data={channels} />
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}
