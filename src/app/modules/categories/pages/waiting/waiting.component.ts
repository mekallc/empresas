import { selectCompanyList } from './../../../../states/selector/company.selector';
import { Observable, timer } from 'rxjs';
import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ModalController, AlertController, NavController, LoadingController } from '@ionic/angular';
import { RoomsChatPage } from '@modules/chat/pages/rooms/rooms.page';
import { StorageService } from '@core/services/storage.service';
import { SoporteChatPage } from '@modules/chat/pages/soporte/soporte.page';
import { ConnectService } from '@modules/chat/services/connect.service';
import { Router } from '@angular/router';
import { DbCategoriesService } from '@modules/categories/services/db-categories.service';
import { Store } from '@ngrx/store';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

declare let google: any;

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.scss'],
})
export class WaitingComponent implements OnInit, AfterViewInit {

  @Input() res: any;
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  room$: Observable<any>;
  map: any;
  company: any = [];
  company$: Observable<any>;
  openImage = false;
  slideOpts = {
    freeMode: true,
    spaceBetween: 10,
    slidesPerView: 2.3,
    allowTouchMove: true,
  };

  constructor(
    private store: Store,
    private router: Router,
    private conn: ConnectService,
    private navCtrl: NavController,
    private storage: StorageService,
    private db: DbCategoriesService,
    private photoViewer: PhotoViewer,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadCrtl: LoadingController,
  ) { }

  async ngOnInit() {
    this.company = await this.storage.getStorage('company');
    this.company$ = this.store.select(selectCompanyList);
  }

  ngAfterViewInit(): void {
    this.loadMap();
  }

  onCancel = async () => {
    const alert = await this.alertCtrl.create({
      header: 'INFO',
      message: 'Do you want to cancel this service?',
      buttons: [
        { text: 'Cancel', role: 'cancel', cssClass: 'secondary', handler: () => {} },
        { text: 'Ok', handler: () => console.log('Confirm Okay') }
      ]
    });
    await alert.present();
  };

  onActive = (status: string) => {
    if(status === 'IN_PROCESS') { this.modalChat(); }
    else { this.onCancel(); }
  };

  onRoom = (code: string) => {
    this.modalCtrl.dismiss();
    this.router.navigate(['chat', 'room', code]);
    // this.navCtrl.navigateRoot(`/chat/room/${code}`);
  };

  onAceptService = async () => {
    const load = await this.loadCrtl.create({message: 'Proccesing...'});
    load.present();
    timer(1200).subscribe(() => {
      this.db.statusService(this.res.id, 'ACCEPTED', this.company.id).subscribe(
      (res) => { load.dismiss(); },
      (err) => { load.dismiss(); });
    });
    this.modalCtrl.dismiss();
  };
  onCancelService = async () => {
    const alert = await this.alertCtrl.create({
      header: 'Info',
      message: 'Do you want to cancel the service?',
      buttons: [
        {
          text: 'Cancel', role: 'cancel',
          cssClass: 'secondary', handler: (blah) => {}
        }, {
          text: 'Delete',
          handler: () => {
            this.db.statusService(this.res.id, 'CANCELLED', this.company.id)
            .subscribe((res) => console.log(res));
            this.modalCtrl.dismiss();
          }
        }
      ]
    });
    alert.present();
  };

  loadMap() {
    const latLng = new google.maps.LatLng(this.res.maps.lat_origin, this.res.maps.lon_origin);
    const marker = new google.maps.Marker({ position: latLng });
    const mapOptions = {
      zoom: 18, center: latLng,
      disableDefaultUI:true,
      gestureHandling: 'none',
      keyboardShortcuts: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    marker.setMap(this.map);
  }

  onClose = () => this.modalCtrl.dismiss();

  toogle = () => this.openImage = !this.openImage;
  openPicture = (url: string) => this.photoViewer.show(url, '', { share: true });

  private modalChat = async () => {
    const chat = await this.modalCtrl.create({ component: SoporteChatPage });
    await chat.present();
  };

  private slug(value: string) {
    let text = value.toLowerCase();
    if (text.charAt(0) === ' ') { text = text.trim(); }
    text = text.replace(/ +/g, '-');
    text = text.replace(/--/g, '-');
    text = text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    text = text.replace(/[^a-zA-Z0-9 -]/g, '');
    return text;
  }
}
