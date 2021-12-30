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
      launchAutoHide: false,
      splashImmersive: false,
      splashFullScreen: false,
      launchShowDuration: 500,
      backgroundColor: '#080f18',
      androidScaleType: 'CENTER_INSIDE',
      androidSplashResourceName: 'splash',
    },
  },
  android: {
    allowMixedContent: true
  },
  // server: {
  //   cleartext: true,
  //   url: 'http://192.168.250.163:8100',
  //   // url: 'http://192.168.1.8:8100'
  // },
};

export default config;
