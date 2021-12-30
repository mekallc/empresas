import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

  ],
  providers: [
    NativeGeocoder,
    Globalization,
    PhotoViewer
  ]
})
export class CoreConfigModule { }
