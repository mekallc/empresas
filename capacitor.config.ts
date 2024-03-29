import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mekadevelopments.lt',
  appName: 'Meka LT',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    SplashScreen: {
      launchAutoHide: true,
      splashImmersive: false,
      splashFullScreen: false,
      launchShowDuration: 1000,
      backgroundColor: '#222428',
      spinnerColor: "#E7B63A",
      androidScaleType: 'CENTER_CROP',
      androidSplashResourceName: 'splash',
    },
  },
  android: {
    allowMixedContent: true
  },
  // server: {
  //   cleartext: true,
  //   url: 'http://192.168.250.114:8102',
  // },
};

export default config;
