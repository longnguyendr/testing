import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    marginTop: 30,
  },
  title: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  cardContainer: {
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
    width: 220,
  },
});
