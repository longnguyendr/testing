/* eslint-disable no-unused-vars */
/*This is an Example of YouTube integration in React Native*/
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  PixelRatio,
  Dimensions,
  Platform,
} from 'react-native';
import YouTube, {
  YouTubeStandaloneIOS,
  YouTubeStandaloneAndroid,
} from 'react-native-youtube';
import styles from './css/style-player';
import YBKey from './env';

export default class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      status: null,
      quality: null,
      error: null,
      isPlaying: true,
      isLooping: false,
      duration: 0,
      currentTime: 0,
      fullscreen: false,
      containerMounted: false,
      containerWidth: null,
      playlist: null,
      // playlist: ['HcXNPI-IPPM', 'XXlZfc1TrD0', 'czcjU1w-c6k', 'uMK0prafzw0'],
    };
    this._youTubeRef = React.createRef();
  }
  
  componentDidUpdate() {
    // console.log(this._youTubeRef);
  }
  render() {
    // console.log(
    //   'props from players',
    //   this.props.navigation.state.params.channels.playlist,
    // );
    console.log('render: ', this._youTubeRef);
    return (
      <ScrollView
        style={styles.container}
        onLayout={({
          nativeEvent: {
            layout: {width},
          },
        }) => {
          if (!this.state.containerMounted) {
            this.setState({
              containerMounted: true,
              playlist: this.props.navigation.state.params.channels.playlist,
            });
          }
          if (this.state.containerWidth !== width) {
            this.setState({containerWidth: width});
          }
        }}>
        {this.state.containerMounted && (
          <View>
            <YouTube
              //view components at Youtube.android.js
              // ref={component => {
              //   this._youTubeRef = component;
              // }}
              ref={this._youTubeRef}
              // You must have an API Key for the player to load in Android
              // apiKey=""
              apiKey={YBKey}
              // videoId="XXlZfc1TrD0"
              // videoIds={this.props.navigation.state.params.channels.playlist}
              videoIds={this.state.playlist}
              // videoIds={['HcXNPI-IPPM', 'uMK0prafzw0', 'XXlZfc1TrD0']}
              // playlistId="PLF797E961509B4EB5"
              play={this.state.isPlaying}
              loop={this.state.isLooping}
              fullscreen={this.state.fullscreen}
              controls={0}
              style={[
                {
                  height: PixelRatio.roundToNearestPixel(
                    this.state.containerWidth / (16 / 9),
                  ),
                },
                styles.player,
              ]}
              onError={e => this.setState({error: e.error})}
              onReady={e => this.setState({isReady: true})}
              onChangeState={e => this.setState({status: e.state})}
              onChangeQuality={e => this.setState({quality: e.quality})}
              onChangeFullscreen={e =>
                this.setState({fullscreen: e.isFullscreen})
              }
              onProgress={e =>
                this.setState({
                  duration: e.duration,
                  currentTime: e.currentTime,
                })
              }
            />
          </View>
        )}

        {/* Playing / Looping */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState(s => ({isPlaying: !s.isPlaying}))}>
            <Text style={styles.buttonText}>
              {this.state.status == 'playing' ? 'Pause' : 'Play'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState(s => ({isLooping: !s.isLooping}))}>
            <Text style={styles.buttonText}>
              {this.state.isLooping ? 'Looping' : 'Not Looping'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Previous / Next video */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              this._youTubeRef.current && this._youTubeRef.current.previousVideo()
            }>
            <Text style={styles.buttonText}>Previous Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              this._youTubeRef.current && this._youTubeRef.current.nextVideo()
            }>
            <Text style={styles.buttonText}>Next Video</Text>
          </TouchableOpacity>
        </View>

        {/* Update Progress & Duration (Android) */}
        {Platform.OS === 'android' && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                this._youTubeRef.current
                  ? this._youTubeRef.current
                      .getCurrentTime()
                      .then(currentTime => this.setState({currentTime}))
                      .catch(errorMessage =>
                        this.setState({error: errorMessage}),
                      ) &&
                    this._youTubeRef.current
                      .getDuration()
                      .then(duration => this.setState({duration}))
                      .catch(errorMessage =>
                        this.setState({error: errorMessage}),
                      )
                  : ''
              }>
              <Text style={styles.buttonText}>
                Update Progress & Duration (Android)
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Show Progress */}
        <Text style={styles.instructions}>
          Progress: {Math.trunc(this.state.currentTime)}s (
          {Math.trunc(this.state.duration / 60)}:
          {Math.trunc(this.state.duration % 60)}s)
          {Platform.OS !== 'ios' && (
            <Text> (Click Update Progress & Duration)</Text>
          )}
        </Text>

        <Text style={styles.instructions}>
          {this.state.error ? 'Error: ' + this.state.error : ''}
        </Text>
      </ScrollView>
    );
  }
}
