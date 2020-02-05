import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator, HeaderBackButton} from 'react-navigation-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import Main from './src/main';
import Home from './src/home';
import Player from './src/components/player';

const MainNavigator = createStackNavigator(
  {
    Home: {screen: Home},
    Main: {screen: Main},
    Player: {
      screen: Player,
      // navigationOptions: ({navigation}) => {
      //   return {
      //     headerLeft: (
      //       <HeaderBackButton onPress={() => console.log(navigation)} />
      //     ),
      //   };
      // },
    },
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
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
