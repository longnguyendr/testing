/* eslint-disable no-unused-vars */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  PixelRatio,
  BackHandler,
} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
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
      optAutoPlay: 'autoPlay',
      progress: 0,
      resumevideosIndexProps: null,
      resumeTimeProps: null,
      resumeVideoIdProps: null,
      videoResume: true,
      videosSeekTo: true,
      videoShow: true,
      show: false,
      fetchingTime: true,
      backHandlerOnFullScreen: true,
    };
    this._youTubeRef = React.createRef();
    this.controlHandler = this.controlHandler.bind(this);
    this.setParamsHandler = this.setParamsHandler.bind(this);
    this.sendBackHandler = this.sendBackHandler.bind(this);
    this.shouldUpdateHandler = this.shouldUpdateHandler.bind(this);
    this.didUpdateHandler = this.didUpdateHandler.bind(this);
    this.fetchingTimePerSecHandler = this.fetchingTimePerSecHandler.bind(this);
    this.timeCount = null;
  }

  UNSAFE_componentWillMount() {
    this.willMountHandler();
  }

  componentDidMount() {
    this.setParamsHandler();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.sendBackHandler,
    );
  }
  shouldComponentUpdate(nextProps, nextState) {
    this.shouldUpdateHandler(nextProps, nextState);
    return true;
  }
  componentDidUpdate(prevProps, prevState) {
    this.didUpdateHandler(prevProps, prevState);
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }

  /**
   * Lifecycle handler
   */
  shouldUpdateHandler = (nextProps, nextState) => {
    if (this.state.fullscreen && !this.state.backHandlerOnFullScreen) {
      this.backHandler.remove();
      this.setState({backHandlerOnFullScreen: true});
    }
    if (!this.state.fullscreen && this.state.backHandlerOnFullScreen) {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.sendBackHandler,
      );
      this.setState({backHandlerOnFullScreen: false});
    }
    if (nextState.isReady) {
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
    if (
      nextState.status === 'ended' &&
      nextState.currentTime === nextState.duration
    ) {
      this.controlHandler(this.state.optAutoPlay);
    }
  };
  didUpdateHandler = (prevProps, prevState) => {
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
        this.controlHandler(this.state.optAutoPlay);
      }
    }
  };
  /**
   * Send back data of current video in order to resume
   */
  setParamsHandler = () => {
    this.props.navigation.setParams({
      sendBackHandler: this.sendBackHandler,
    });
  };
  sendBackHandler = async opt => {
    const {resumeData} = this.props.navigation.state.params;
    const {channels} = this.props.navigation.state.params;
    clearInterval(this.timeCount);
    if (!this.state.fetchingTime) {
      await this.props.navigation.state.params.returnData(
        channels.id,
        channels.name,
        this.state.videosIndex,
        this.state.currentTime,
        this.state.playlist[this.state.videosIndex],
      );
      this.props.navigation.goBack();
    } else if (this.state.fetchingTime) {
      if (resumeData !== null && resumeData !== undefined) {
        await this.props.navigation.state.params.returnData(
          resumeData.channelID,
          resumeData.channelName,
          resumeData.videoIndex,
          resumeData.currentTime,
          resumeData.videoID,
        );
      }
      this.props.navigation.goBack();
    }
    return true;
  };

  /**
   * Resume video and time
   */
  resumeVideoHandler = () => {
    this._youTubeRef.current.playVideoAt(this.state.resumevideosIndexProps);
    this.setState({videoResume: false, isPlaying: true});
  };
  videosSeekToHandler = () => {
    this._youTubeRef.current.seekTo(this.state.resumeTimeProps);
    this.setState({videosSeekTo: false, isPlaying: true});
  };
  /**
   * Save state playlist and load player
   */
  willMountHandler = () => {
    const {resumeData} = this.props.navigation.state.params;
    if (resumeData !== null && resumeData !== undefined) {
      this.setState({
        resumevideosIndexProps: resumeData.videoIndex,
        resumeTimeProps: resumeData.currentTime,
        resumeVideoIdProps: resumeData.videoID,
      });
    }
    if (!this.state.containerMounted) {
      this.setState({
        containerMounted: true,
        playlist: this.props.navigation.state.params.channels.playlist,
      });
    }
  };

  /**
   * fetching time and duration event
   */
  durationHandler = Opt => {
    if (this._youTubeRef.current !== null) {
      switch (Opt) {
        case this.state.optDuration:
          this._youTubeRef.current
            .getDuration()
            .then(duration => this.setState({duration}))
            .catch(errorMessage => this.setState({error: errorMessage}));
          this._youTubeRef.current
            .getVideosIndex()
            .then(index => this.setState({videosIndex: index}))
            .catch(errorMessage => this.setState({error: errorMessage}));
          break;
        case this.state.optTime:
          this._youTubeRef.current
            .getCurrentTime()
            .then(currentTime => {
              this.setState({
                currentTime,
                fetchingTime: false,
              });
              !isNaN(currentTime / this.state.duration)
                ? this.setState({progress: currentTime / this.state.duration})
                : '';
            })
            .catch(errorMessage => this.setState({error: errorMessage}));
          this._youTubeRef.current
            .getVideosIndex()
            .then(index => this.setState({videosIndex: index}))
            .catch(errorMessage => this.setState({error: errorMessage}));
          break;
      }
    }
  };
  fetchingTimePerSecHandler = () => {
    this.timeCount = setInterval(
      () => this.durationHandler(this.state.optTime),
      400,
    );
  };
  /**
   * Next, Previous button and AutoPlay event
   */
  controlHandler = controlOpt => {
    const currentVideoIndex = this.state.videosIndex;
    const lastVideoIndex = this._youTubeRef.current.props.videoIds.length - 1;
    const isNotLastVideoIndex = currentVideoIndex < lastVideoIndex;
    const isNotFirstVideo = this.state.videosIndex > 0;
    const isPlaylistNotEmpty = this._youTubeRef.current.props.videoIds !== null;
    const isPlaylistArray = Array.isArray(
      this._youTubeRef.current.props.videoIds,
    );
    const isLastVideoIndex = currentVideoIndex === lastVideoIndex;
    const isFirstVideoIndex = currentVideoIndex === 0;
    if (this._youTubeRef.current !== null) {
      switch (controlOpt) {
        case this.state.optNext:
          if (isNotLastVideoIndex && isPlaylistNotEmpty && isPlaylistArray) {
            this._youTubeRef.current.playVideoAt(this.state.videosIndex + 1);
          } else if (isLastVideoIndex) {
            this._youTubeRef.current.playVideoAt(0);
          }
          break;
        case this.state.optPrevious:
          if (isNotFirstVideo && isPlaylistNotEmpty && isPlaylistArray) {
            this._youTubeRef.current.playVideoAt(this.state.videosIndex - 1);
          } else if (isFirstVideoIndex) {
            this._youTubeRef.current.playVideoAt(lastVideoIndex);
          }
          break;
        case this.state.optAutoPlay:
          this.setState({
            currentTime: 0,
            error: '',
          });
          if (isNotLastVideoIndex && isPlaylistNotEmpty && isPlaylistArray) {
            this._youTubeRef.current.playVideoAt(this.state.videosIndex + 1);
          } else if (isLastVideoIndex) {
            this._youTubeRef.current.playVideoAt(0);
          }
          break;
      }
    }
  };

  secToTime = time => {
    // eslint-disable-next-line no-bitwise
    return ~~(time / 60) + ':' + (time % 60 < 10 ? '0' : '') + ~~(time % 60);
  };
  durationToTime = () => {
    return (
      Math.trunc(this.state.duration / 60) +
      ':' +
      (this.state.duration % 60 < 10 ? '0' : '') +
      Math.trunc(this.state.duration % 60)
    );
  };

  render() {
    const {navigation} = this.props;
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
          if (this.state.containerWidth !== width) {
            this.setState({containerWidth: width});
          }
        }}>
        {this.state.containerMounted && (
          <View
            style={this.state.show ? styles.playerContainer : styles.hidden}>
            <View>
              <YouTube
                ref={this._youTubeRef}
                apiKey={YBKey}
                videoIds={this.state.playlist}
                play={this.state.isPlaying}
                loop={this.state.isLooping}
                rel={this.state.isRel}
                fullscreen={this.state.fullscreen}
                controls={1}
                showInfo={false}
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
                onProgress={e => this.progressHandler(e)}
                resumePlayAndroid={this.state.resumePlayAndroid}
              />
            </View>
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

        {/* Show Progress */}
        <Text style={styles.instructions}>
          Progress:{' '}
          {this.secToTime(
            Math.floor(this.state.progress * this.state.duration),
          )}{' '}
          ({this.durationToTime()})
        </Text>

        <ProgressBar progress={this.state.progress} width={250} height={20} />

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
