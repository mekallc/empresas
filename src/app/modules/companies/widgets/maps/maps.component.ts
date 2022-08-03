import { Component, ElementRef, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { LoadingController, AlertController, IonSearchbar, NavController } from '@ionic/angular';
import { Geolocation, Position } from '@capacitor/geolocation';
import { MapsAPILoader } from '@agm/core';
import { DbCompaniesService } from '@modules/companies/services/db-companies.service';
import { Observable, timer } from 'rxjs';
import { AppState } from '@store/app.state';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

// declare const google: any;

@Component({
  selector: 'app-user-maps-widget',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsWidgetComponent implements  OnInit, OnChanges {
  private geoCoder;
  showMaps = false;
  // lat: number = 18.4670;
  // lng: number = -69.9316;
  lat: number;
  lng: number;
  address: string;

  constructor(
    private store: Store<AppState>,
    private db: DbCompaniesService,
    private nav: NavController,
    private alertCtrl: AlertController,
    private mapsAPILoader: MapsAPILoader,
    private loadingCtrl: LoadingController,
  ) {
    this.getInitMaps();
  }

  ngOnInit() {
    this.checkPermission();
    this.geoCoder = new google.maps.Geocoder();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  getInitMaps() {
    console.log('INIT');
    const maps$ = this.store.select('position');
    maps$.pipe(
      filter(row => !row.loading),
      filter(({ position }) => position),
    )
    maps$.subscribe(res => this.getLatLng(res.position));
  }

  getLatLng = (position: any) => {
    console.log(position);
    this.lat = position.lat();
    this.lng = position.lng();
    this.getAddress(this.lat, this.lng);
  }

  setOnAddress = (ev: google.maps.MouseEvent) => {
    this.lat = ev.latLng.lat();
    this.lng = ev.latLng.lng();
    this.getAddress(this.lat, this.lng);
  }
  getAddress = (lat: number, lng: number) => {
    this.geoCoder.geocode({ 'location': { lat, lng } }, (results, status) => {
      console.log(results);
      if (status === 'OK') {
        if (results[0]) { this.address = results[0].formatted_address; }
        else { this.alertError('No se encontro ningun resultado') }
      } else { this.alertError('Geocode Fallo ' + status); }
    });
  };

  roundNumber = (num = 0) => num.toFixed(4);

  onClose = async (): Promise<void> => {
    this.db.setAddress$({lat: this.lat, lng: this.lng, address: this.address});
    const load = await this.loadingCtrl.create({
      message: 'Salvando información de ubicación', duration: 1500, });
    load.present();
    timer(1500).subscribe(() => this.nav.navigateRoot('register-company'));
  }

  checkPermission = async () => {
    const check = await Geolocation.checkPermissions();
    const load = await this.loadingCtrl.create({ message: 'Processing...', duration: 2000 });
    console.log(check);
    if (check.location === 'granted') {
      load.present();
    } else {
      if(check.location === 'denied') {
        const alert: HTMLIonAlertElement = await this.alertCtrl.create({
          mode:'ios', header: 'Error', message: 'Debe habilitar el GS',
          buttons:[ { text: 'Okay', handler: () => this.nav.navigateRoot('register-company') } ]
        });
        alert.present();
      }
      else {
        const request = await Geolocation.requestPermissions();
        if(request.location === 'granted') {
          load.present();
        } else {
          this.nav.navigateRoot('register-company')
        }
      }
    }
  };

  private alertError = async(message: string) => {
    const alert = await this.alertCtrl.create({
      mode:'ios',
      header: 'Error',
      message,
      buttons: ['OK']
    })
    alert.present();
  };
}

