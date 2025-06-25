import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const VerifySuccessScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require('@/assets/images/nen.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Xác thực thành công!</Text>
          <Text style={styles.subtitle}>Email của bạn đã được xác thực thành công</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/Shopping.png')}
            style={styles.successImage}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.replace('/userRouter/login')}
        >
          <Text style={styles.buttonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
  },
  gradient: {
    position: 'absolute',
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  textContainer: {
    alignItems: 'flex-start',
    marginTop: 80,
    marginBottom: 20,
    paddingLeft: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
    paddingHorizontal: 0,
    lineHeight: 24,
  },
  imageContainer: {
    width: width * 0.7,
    height: width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  successImage: {
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: '#41C4E1',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 

export default VerifySuccessScreen;