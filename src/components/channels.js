/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {Text, View, Image, ScrollView} from 'react-native';
import styles from './css/style-channels';

class Channels extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const data = this.props.data;
    //    console.log(data);
    // console.log(this.props);
    return (
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Image source={{uri: data.icon}} style={styles.image} />
          <Text style={styles.title}>{data.name}</Text>
        </View>
      </View>
    );
  }
}

export default Channels;
