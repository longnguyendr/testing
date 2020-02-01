import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import Main from './src/main';
import Home from './src/home';
import Player from './src/components/player';

const MainNavigator = createStackNavigator(
  {
    Home: {screen: Home},
    Main: {screen: Main},
    Player: {screen: Player},
  },
  {
    initialRouteName: 'Home',
    // initialRouteName: 'Main',
  },
);

const AppContainer = createAppContainer(MainNavigator);

export default class App extends Component {
  render() {
    return (
      <SafeAreaProvider>
        <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
          <AppContainer />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}