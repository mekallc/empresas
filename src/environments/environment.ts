// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    projectId: 'meka-app',
    appId: '1:882572463657:web:96f5f79d52d0ef1ae69638',
    storageBucket: 'meka-app.appspot.com',
    locationId: 'southamerica-east1',
    apiKey: 'AIzaSyAZQUQ65vngYX7_MWDqYDZ5utNn9yGkiWo',
    authDomain: 'meka-app.firebaseapp.com',
    messagingSenderId: '882572463657',
    measurementId: 'G-JG99NW4H1J',
  },
  maps: 'AIzaSyAylhtwYmgO_nuFZsQzvm_z6vAOvbEk80Q',
  api: {
    url: 'https://api.meka.do/api',
    version: 'v1',
    headers: {
      Authorization: '',
    },
    admin: {email: 'knaimero@gmail.com', password: 'meka123'}
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
