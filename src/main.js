import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import data from './models/data';
import Channels from './components/channels';
import styles from './components/css/style-main';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      sources: data,
    };
  }
  componentDidMount() {
    console.log('Main Mounted');
  }
  componentWillUnmount() {
    console.log('Main unmount');
  }
  handleClick = channels => {
    const {navigation} = this.props;
    // this.props.navigation.push('Player', {channels: channels});
    // navigation.actions.reset(
    //   navigation.push('Player', {channels: channels}),
    //   0,
    // );
    navigation.navigate('Player', {channels: channels});
  };

  render() {
    // console.log(this.props);
    return (
      <View style={styles.container}>
        <ScrollView horizontal>
          {this.state.sources.map(channels => (
            <TouchableOpacity
              key={channels.id}
              onPress={() => this.handleClick(channels)}>
              <Channels data={channels} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
}
