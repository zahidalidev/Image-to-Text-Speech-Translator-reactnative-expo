/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { Component } from 'react';
import {
  Platform
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {
  ToastBannerProvider,
  ToastBannerPresenter
} from 'react-native-toast-banner';

import HomeScreen from './app/screen/HomeScreen';
import AppDrawer from './app/component/AppDrawer';
import TranslateScreen from './app/screen/TranslateScreen';
import OCRScreen from './app/screen/OCRScreen';
import ResultScreen from './app/screen/ResultScreen';
import colors from './app/config/colors';
import TextToVoice from './app/screen/TextToVoice';
import { AdMobInterstitial, setTestDeviceIDAsync, isAvailableAsync } from "expo-ads-admob"
import { anterstitialIdHome } from './app/config/AdIds';

const Stack = createDrawerNavigator();


//interstitial: ca-app-pub-3883602119077591/7824597044
//history screen banner: ca-app-pub-3883602119077591/3119065274

class App extends Component {
  state = {
    image: null,
    interstitialAdId: "ca-app-pub-3883602119077591/7824597044"
  }


  // getPermissionAsync = async () => {
  //   // Camera roll Permission 
  //   if (Platform.OS === 'ios') {
  //     const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY());
  //     if (status !== 'granted') {
  //       alert('Sorry, we need camera roll permissions to make this work!');
  //     }
  //   }
  //   // Camera Permission
  //   const { status } = await Permissions.askAsync(Permissions.CAMERA);
  //   this.setState({ hasPermission: status === 'granted' });
  // }


  imagePickerBody = async (response, navigation) => {
    // Same code as in above section!
    if (response.cancelled) {
      console.log('User cancelled image picker');
      navigation.navigate('Home')
    }
    else if (response.error) {
      console.log('Image Picker Error: ', response.error);
    }

    else {
      // let source = { uri: response.uri };
      this.setState({ image: response })
      navigation.navigate('OCRScreen', { data: response })

    }
  }

  getImg = async (selection, navigation) => {
    // this.getPermissionAsync()

    const options = {
      allowsEditing: true,
    }

    if (selection === "camera") {
      let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }


      let pickerResult = await ImagePicker.launchCameraAsync(options);

      await this.imagePickerBody(pickerResult, navigation)

    } else {
      let permissionResult = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      let pickerResult = await ImagePicker.launchImageLibraryAsync(options);
      this.imagePickerBody(pickerResult, navigation)
    }

  }

  componentDidMount = async () => {
    // const available = await isAvailableAsync()
    // await setTestDeviceIDAsync('EMULATOR')
    await AdMobInterstitial.setAdUnitID(anterstitialIdHome); //test
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
    await AdMobInterstitial.showAdAsync()

    // console.log(Platform)
  }

  render() {
    return (
      <ToastBannerProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home"
            drawerType={"front"}
            overlayColor="transparent"
            edgeWidth={100}
            drawerStyle={{
              backgroundColor: colors.white,
              width: "75%"
            }}
            drawerContent={(props) => <AppDrawer {...props} />}
          >

            {/* Two Method to navigate to components */}
            <Stack.Screen name="Home">{(props) => <HomeScreen {...props} onGetImg={this.getImg} />}</Stack.Screen>
            <Stack.Screen name="OCRScreen">{(props) => <OCRScreen {...props} />}</Stack.Screen>
            <Stack.Screen name="ResultScreen">{(props) => <ResultScreen {...props} />}</Stack.Screen>
            <Stack.Screen name="TextToVoice" options={{ title: "TextToVoice" }} component={TextToVoice} />
            <Stack.Screen name="TranslateScreen" options={{ title: "TranslateScreen" }} component={TranslateScreen} />
          </Stack.Navigator>
        </NavigationContainer>

        <ToastBannerPresenter />
      </ToastBannerProvider>
    );
  }
};


export default App;
