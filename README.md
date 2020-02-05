### Description
React-Native Youtube integrate 
### Technologies
* React-native

### Prerequisites to run
* [React-native-cli](https://facebook.github.io/react-native/docs/getting-started)
* [Node.js](https://nodejs.org/en/download/)
* [Android Studio (android emulator) or real android devices](https://developer.android.com/studio)

### Installing
Clone the project:
```
$ git clone https://github.com/longnguyendr/testing.git
```
Install the dependencies:
```
$ cd testing
$ npm install
```
Before run the app you must generate the API Key:

<p align="center">
<img width="600px" height="250px" src ="./src/assets/image/youtube1.png" /></p>

<p align="center">
<img width="600px" height="250px" src ="./src/assets/image/youtube2.png" /></p>

<p align="center">
<img width="600px" height="250px" src ="./src/assets/image/youtube3.png" /></p>

<p align="center">
<img width="600px" height="250px" src ="./src/assets/image/youtube4.png" /></p>

<p align="center">
<img width="600px" height="250px" src ="./src/assets/image/youtube5.png" /></p>


or
```
$ cordova platform add android 
```
Login and download the Api_key at [Openweathermap](https://openweathermap.org/)
```
$ Create a file called "apiKey.json" in root folder and add the following object to the file:
$
{
    "openWeatherKey": "Your API_KEY"
}
```
Build the package:
```
$ npm run build-dev (for development mode) or npm run build-prod (for production mode)
```
Run the App:
```
$ cordova run android 
```
or
```
$ cordova run browser
```
### Author
Long Nguyen