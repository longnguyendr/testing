import React, {Component} from 'react';
import {View, Text, ScrollView, Button} from 'react-native';
import styles from './components/css/style-main';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }
  componentDidMount() {
    //Here is the Trick
    console.log('mount Home');
  }
  componentWillUnmount() {
    console.log('unmount Home');
  }

  componentDidUpdate() {
    console.log('home update');
  }
  render() {
    const {navigation} = this.props;
    console.log('props from home: ', this.props);
    return (
      <View style={styles.container}>
        <Button title="Press me" onPress={() => navigation.navigate('Main')} />
      </View>
    );
  }
}
