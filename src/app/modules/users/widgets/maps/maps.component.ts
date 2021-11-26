import { Component, ElementRef, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Geolocation } from '@capacitor/geolocation';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { DbUserService } from '@modules/users/services/db-user.service';


declare let google: any;

@Component({
  selector: 'app-user-maps-widget',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsWidgetComponent implements OnInit, OnChanges {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  maps: any = [];
  address: string;
  latitude: number;
  longitude: number;

  constructor(
    // private geolocation: Geolocation,
    private db: DbUserService,
    private modalCtrl: ModalController,
    private nativeGeocoder: NativeGeocoder,
  ) {
  }


  ngOnInit() {
    this.loadMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    console.log(this.address);
  }
  loadMap() {
    Geolocation.getCurrentPosition().then((resp) => {
      // this.latitude = -25.6180;
      // this.longitude = -49.2976;
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      const latLng = new google.maps.LatLng(this.latitude, this.longitude);
      const mapOptions = { center: latLng, zoom: 17, mapTypeId: google.maps.MapTypeId.ROADMAP };
      this.getAddressFromCoords(this.latitude, this.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.addListener('dragend', () => {
        this.address = 'Loading...';
        this.latitude = this.map.center.lat();
        this.longitude = this.map.center.lng();
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng());
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getAddressFromCoords = (latitude: number, longitude: number) => {
    const options: NativeGeocoderOptions = { useLocale: true, maxResults: 5 };
    this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
    .then((result: NativeGeocoderResult[]) => {
      this.address = '';
      const dados = result[0];
      const add = [
        dados.thoroughfare +'-'+ dados.subThoroughfare, dados.subLocality,
        dados.subAdministrativeArea +'-'+ dados.administrativeArea, 'ZIP '+ dados.postalCode, dados.countryName +'.'
      ];
      this.maps = {
        zip: dados.postalCode,
        country: dados.countryName,
        street: dados.thoroughfare,
        num: dados.subThoroughfare,
        district:dados.subLocality,
        state: dados.administrativeArea,
        city: dados.subAdministrativeArea,
        latitude,
        longitude
      };
      for (const value of add) { this.address += value + ', '; }
    })
    .catch((error: any) => {
      this.address = 'Address Not Available!';
    });
  };


  onClose = () => {
    this.db.setAddress$(this.maps);
    this.modalCtrl.dismiss();
  };
}
