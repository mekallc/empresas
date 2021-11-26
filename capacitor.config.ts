import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mekadevelopments.lt',
  appName: 'Meka Empresa',
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
  server: {
    cleartext: true,
    url: 'http://192.168.250.163:8101',
  },
};

export default config;
