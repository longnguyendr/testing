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
  Icon,
  Button,
  Platform,
  ImageBackground,
} from 'react-native';
import {HeaderBackButton} from 'react-navigation-stack';
import YouTube from 'react-native-youtube';
import styles from './css/style-player';
import YBKey from './env';

export default class Player extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => {
    const {params = {}} = navigation.state;
    let headerLeft = (
      <HeaderBackButton onPress={() => params.sendBackHandler()} />
    );
    return {headerLeft};
  };
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      status: null,
      quality: null,
      error: null,
      isPlaying: true,
      isLooping: false,
      isRel: false,
      duration: 0,
      currentTime: 0,
      fullscreen: false,
      containerMounted: false,
      containerWidth: null,
      playlist: null,
      videoId: null,
      keyId: null,
      resumePlayAndroid: true,
      optDuration: 'duration',
      optTime: 'time',
      optNext: 'nextVideo',
      optPrevious: 'previousVideo',
      resumevideosIndexProps: null,
      resumeTimeProps: null,
      resumeVideoIdProps: null,
      videoResume: true,
      videosSeekTo: true,
      videoShow: true,
      show: false,
      fetchingTime: true,
      // playlist: ['HcXNPI-IPPM', 'XXlZfc1TrD0', 'czcjU1w-c6k', 'uMK0prafzw0'],
    };
    this._youTubeRef = React.createRef();
    this.controlHandler = this.controlHandler.bind(this);
    this.autoPlayHandler = this.autoPlayHandler.bind(this);
    this.setParamsHandler = this.setParamsHandler.bind(this);
    this.fetchingTimePerSecHandler = this.fetchingTimePerSecHandler.bind(this);
    this.timeCount = null;
  }

  // videoIndex, currentTime, VideoId
  UNSAFE_componentWillMount() {
    console.log('willmount');
    // console.log(this.props);
    this.willMountHandler();
  }

  componentDidMount() {
    // console.log('componentdidmount: ', this._youTubeRef);
    // console.log('componentDidMount: ', this.props);
    // console.log('state.playlist: ', this.state.playlist);
    // console.log('State.resumeVideoID: ', this.state.resumeVideoIdProps);
    this.setParamsHandler();
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log('prevState: ', prevState);
    // console.log('current Time: ', this.state.currentTime);
    // console.log('prev Duration', prevState.duration);
    if (this._youTubeRef.current !== null) {
      if (this.state.status !== prevState.status) {
        this.durationHandler(this.state.optDuration);
      }
      if (prevState.status === 'buffering' && this.state.fetchingTime) {
        this.fetchingTimePerSecHandler();
      }
      if (
        prevState.status === 'stopped' &&
        this.state.currentTime === prevState.duration &&
        prevState.duration !== 0
      ) {
        this.autoPlayHandler();
        // console.log('current Time: ', this.state.currentTime);
        // console.log('prev Duration', prevState.duration);
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    // console.log('nextState', nextState);
    // console.log('nextProps', nextProps);
    // console.log(this.state.currentTime);
    if (nextState.isReady) {
      // console.log(this.state.playlist);
      if (this.state.playlist.includes(this.state.resumeVideoIdProps)) {
        if (
          this.state.videoResume &&
          this.state.resumevideosIndexProps !== null
        ) {
          this.resumeVideoHandler();
        }
        if (
          nextState.status === 'playing' &&
          this.state.videosSeekTo &&
          this.state.resumeTimeProps !== null
        ) {
          this.videosSeekToHandler();
        }
      }

      if (nextState.status === 'playing' && this.state.videoShow) {
        this.setState({show: true, videoShow: false});
      }
    }
    // if (nextState.status === 'ended') {
    //   console.log('next state ended');
    //   this.durationHandler(this.state.optTime);
    // }
    return true;
  }

  /**
   * Send back data of current video in order to resume
   */
  setParamsHandler = () => {
    this.props.navigation.setParams({
      sendBackHandler: this.sendBackHandler.bind(this),
    });
  };
  sendBackHandler = () => {
    console.log('sendbackButton press');
    // console.log(this.state.fetchingTime);
    const {resumeData} = this.props.navigation.state.params;
    const {channels} = this.props.navigation.state.params;
    // console.log(resumeData);
    clearInterval(this.timeCount);
    if (!this.state.fetchingTime) {
      this.props.navigation.state.params.returnData(
        channels.id,
        channels.name,
        this.state.videosIndex,
        this.state.currentTime,
        this.state.playlist[this.state.videosIndex],
      );
      this.props.navigation.goBack();
    } else if (this.state.fetchingTime) {
      if (resumeData !== null && resumeData !== undefined) {
        this.props.navigation.state.params.returnData(
          resumeData.channelID,
          resumeData.channelName,
          resumeData.videoIndex,
          resumeData.currentTime,
          resumeData.videoID,
        );
      }
      this.props.navigation.goBack();
    }
  };

  /**
   * Resume video and time
   */
  resumeVideoHandler() {
    this._youTubeRef.current.playVideoAt(this.state.resumevideosIndexProps);
    this.setState({videoResume: false, isPlaying: true});
  }
  videosSeekToHandler() {
    this._youTubeRef.current.seekTo(this.state.resumeTimeProps);
    this.setState({videosSeekTo: false, isPlaying: true});
  }
  /**
   * Save state playlist and load player
   */
  willMountHandler() {
    const {resumeData} = this.props.navigation.state.params;
    console.log('willmount resumeData: ', resumeData);
    if (resumeData !== null && resumeData !== undefined) {
      // console.log('not null');
      this.setState({
        resumevideosIndexProps: resumeData.videoIndex,
        resumeTimeProps: resumeData.currentTime,
        resumeVideoIdProps: resumeData.videoID,
      });
    }
    if (!this.state.containerMounted) {
      this.setState({
        containerMounted: true,
        // videoId: this.state.playlist[0],
        playlist: this.props.navigation.state.params.channels.playlist,
      });
    }
  }

  /**
   * fetching time and duration event
   */
  durationHandler(Opt) {
    if (this._youTubeRef.current !== null) {
      switch (Opt) {
        case 'duration':
          this._youTubeRef.current
            .getDuration()
            .then(duration => this.setState({duration}))
            .catch(errorMessage => this.setState({error: errorMessage}));
          this._youTubeRef.current
            .getVideosIndex()
            .then(index => this.setState({videosIndex: index}))
            .catch(errorMessage => this.setState({error: errorMessage}));
          break;
        case 'time':
          this._youTubeRef.current
            .getCurrentTime()
            .then(currentTime =>
              this.setState({currentTime, fetchingTime: false}),
            )
            .catch(errorMessage => this.setState({error: errorMessage}));
          // this._youTubeRef.current
          //   .getVideosIndex()
          //   .then(index => this.setState({videosIndex: index}))
          //   .catch(errorMessage => this.setState({error: errorMessage}));
          break;
      }
    }
  }
  fetchingTimePerSecHandler = () => {
    this.timeCount = setInterval(
      () => this.durationHandler(this.state.optTime),
      500,
    );
  };
  /**
   * Next, Previous button event
   */
  controlHandler = controlOpt => {
    const a = this.state.videosIndex;
    const b = this._youTubeRef.current.props.videoIds.length - 1;
    const c = a < b;
    const d = this.state.videosIndex > 0;
    const e = this._youTubeRef.current.props.videoIds !== null;
    const f = Array.isArray(this._youTubeRef.current.props.videoIds);
    const g = a === b;
    const h = a === 0;
    if (this._youTubeRef.current !== null) {
      switch (controlOpt) {
        case this.state.optNext:
          console.log(controlOpt);
          if (c && e && f) {
            this._youTubeRef.current.playVideoAt(this.state.videosIndex + 1);
          } else if (g) {
            this._youTubeRef.current.playVideoAt(0);
          }
          break;
        case this.state.optPrevious:
          console.log(controlOpt);
          if (d && e && f) {
            this._youTubeRef.current.playVideoAt(this.state.videosIndex - 1);
          } else if (h) {
            this._youTubeRef.current.playVideoAt(b);
          }
          break;
      }
    }
  };

  /**
   * Auto play after video ended
   */
  autoPlayHandler = () => {
    const a = this.state.videosIndex;
    const b = this._youTubeRef.current.props.videoIds.length - 1;
    const c = a < b;
    const d = this._youTubeRef.current.props.videoIds !== null;
    const e = Array.isArray(this._youTubeRef.current.props.videoIds);
    const f = a === b;
    this.setState({
      currentTime: 0,
    });
    if (c && d && e) {
      this._youTubeRef.current.playVideoAt(this.state.videosIndex + 1);
    } else if (f) {
      this._youTubeRef.current.playVideoAt(0);
    }
  };
  render() {
    const {navigation} = this.props;
    // console.log(this._youTubeRef);
    // console.log('this.state.playlist: ', this.state.playlist);
    return (
      <ScrollView
        key={this.state.keyId}
        style={styles.container}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onLayout={({
          nativeEvent: {
            layout: {width},
          },
        }) => {
          // if (!this.state.containerMounted) {
          //   this.setState({
          //     containerMounted: true,
          //     playlist: this.props.navigation.state.params.channels.playlist,
          //   });
          // }
          if (this.state.containerWidth !== width) {
            this.setState({containerWidth: width});
          }
        }}>
        {this.state.containerMounted && (
          <View style={this.state.show ? styles.show : styles.hidden}>
            <YouTube
              //view components at Youtube.android.js in node_modules.
              // ref={component => {
              //   this._youTubeRef = component;
              // }}
              ref={this._youTubeRef}
              // You must have an API Key for the player to load in Android
              // apiKey=""
              apiKey={YBKey}
              // videoId={this.state.videoId}
              videoIds={this.state.playlist}
              // playlistId="PLF797E961509B4EB5"
              play={this.state.isPlaying}
              loop={this.state.isLooping}
              rel={this.state.isRel}
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
              onProgress={e => this.stateChangeHandler(e)}
              resumePlayAndroid={this.state.resumePlayAndroid}
            />
          </View>
        )}

        {/* Playing */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState(s => ({isPlaying: !s.isPlaying}))}>
            <Text style={styles.buttonText}>
              {this.state.status == 'playing' ? 'Pause' : 'Play'}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Fullscreen */}
        {!this.state.fullscreen && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.setState({fullscreen: true})}>
              <Text style={styles.buttonText}>Set Fullscreen</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Previous / Next video */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.controlHandler(this.state.optPrevious)}>
            <Text style={styles.buttonText}>Previous Video</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.controlHandler(this.state.optNext)}>
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
              <Text style={styles.buttonText}>Update Progress & Duration</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Show Progress */}
        <Text style={styles.instructions}>
          Progress: {Math.trunc(this.state.currentTime)}s (
          {Math.trunc(this.state.duration / 60)}:
          {Math.trunc(this.state.duration % 60)}s)
        </Text>

        <Text style={styles.instructions}>
          {this.state.error ? 'Error: ' + this.state.error : ''}
        </Text>
        {/* Play specific video in a videoIds array by index */}
        {this._youTubeRef.current &&
          this._youTubeRef.current.props.videoIds &&
          Array.isArray(this._youTubeRef.current.props.videoIds) && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.buttonGroup}>
                {this._youTubeRef.current.props.videoIds.map((videoId, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.button}
                    onPress={() =>
                      this._youTubeRef.current &&
                      this._youTubeRef.current.playVideoAt(i)
                    }>
                    <Text
                      style={[
                        styles.buttonText,
                        styles.buttonTextSmall,
                      ]}>{`Video ${i}`}</Text>
                    <Text>{videoId}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        {/* Get current played video's position index when playing videoIds*/}
        <View style={styles.buttonGroup}>
          <Text style={styles.buttonText}>
            Fetch Videos Index: {this.state.videosIndex}
          </Text>
        </View>
      </ScrollView>
    );
  }
}
