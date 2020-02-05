import React, {Component} from 'react';
import {View, ScrollView, ImageBackground} from 'react-native';
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
    };
  }
  componentDidMount() {
    console.log('Main Mounted');
    this.reloadHandler();
  }
  componentWillUnmount() {
    console.log('Main unmount');
    this._refreshScreen.remove();
  }

  reloadHandler = () => {
    this.setState({
      sources: data,
    });
    this._refreshScreen = this.props.navigation.addListener('didFocus', () => {
      console.log('reload screen and update data');
      console.log('state from parent: ', this.state);
      console.log('Props from parent:', this.props);
      this.setState({
        sources: data,
      });
    });
  };

  // returnData = (duration, )
  handleClick = channels => {
    const {navigation} = this.props;
    // this.props.navigation.push('Player', {channels: channels});
    // navigation.actions.reset(
    //   navigation.push('Player', {channels: channels}),
    //   0,
    // );
    navigation.navigate('Player', {
      channels: channels,
      resumeData: this.state.resumeData,
      returnData: this.returnData.bind(this),
    });
  };

  returnData(videoIndex, currentTime) {
    this.setState({resumeData: {videoIndex, currentTime}});
  }
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
