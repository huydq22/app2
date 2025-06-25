import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

const Welcome = () => {
  console.log('Welcome component rendered');
  const [auth, setAuth] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth) {
        //Đẩy đến nhánh user (true)
        router.push('/userRouter/login');
      } else {
        //Đẩy đến nhánh guest (false)
        router.push('/guestRouter');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [auth]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#41C4E1',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: width * 0.8, 
    height: width * 0.8,
  },
});

export default Welcome;