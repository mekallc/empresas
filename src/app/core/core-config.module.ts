import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,

  ],
  providers: [
    AppVersion,
    NativeGeocoder,
  ]
})
export class CoreConfigModule { }
