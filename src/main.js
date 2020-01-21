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
    console.log(this.props);
  }

  handleClick = channels => {
    const {navigation} = this.props;
    // console.log('this is channels from click: ', channels);
    // this.props.navigation.push('Player', {channels: channels});
    navigation.actions.reset(
      navigation.push('Player', {channels: channels}),
      0,
    );
  };

  render() {
    // console.log(this.props);
    return (
      <View style={styles.container}>
        <ScrollView horizontal>
          {data.map(channels => (
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
