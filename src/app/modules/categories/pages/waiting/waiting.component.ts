import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Observable, timer } from 'rxjs';

import * as actions from '@store/actions';
import { AppState } from '@store/app.state';
import { SoporteChatPage } from '@modules/chat/pages/soporte/soporte.page';
import { ConnectService } from '@modules/chat/services/connect.service';
import { DbCategoriesService } from '@modules/categories/services/db-categories.service';
import { RatingModalComponent } from '@modules/rate/pages/rating-modal/rating-modal.component';

declare let google: any;

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.scss'],
})
export class WaitingComponent implements AfterViewInit {

  @Input() res: any;
  @Input() company: number;
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  room$: Observable<any>;
  map: any;
  offline: boolean;
  openImage = false;
  slideOpts = {
    freeMode: true,
    spaceBetween: 10,
    slidesPerView: 2.3,
    allowTouchMove: true,
  };

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private db: DbCategoriesService,
    private photoViewer: PhotoViewer,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadCrtl: LoadingController,
    private chatService: ConnectService,
    ) { }

  ngAfterViewInit(): void {
    this.loadMap();
    console.log(this.res);
    console.log(this.company);
    this.chatService.createRoomServiceChat(this.res, this.company)
    this.store.select('status').subscribe((res: any) => this.offline = res.id);
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
  };

  onAceptService = async () => {
    const load = await this.loadCrtl.create({message: 'Proccesing...'});
    load.present();
    this.db.statusService(this.res.id, 'ACCEPTED', this.company).subscribe(
      (res: any) => {
        this.store.dispatch(actions.loadSolicitud({ id: this.company }));
        this.store.dispatch(actions.loadAccepted({ id: this.company }));
      }
    );
    timer(1200).subscribe(() => {
      load.dismiss();
    });
    this.onClose();
    this.router.navigate(['']);
  };
  onCancelService = async (company: number) => {
    const alert = await this.alertCtrl.create({
      header: 'Info', message: 'Do you want to cancel the service?',
      buttons: [
        { text: 'Cancel', role: 'cancel', handler: () => {} },
        { text: 'OK', handler: async() => {
          const load = await this.loadCrtl.create({ message: 'Processing...' })
          load.present();
          this.store.dispatch(actions.updateSolicitud({ id: this.res.id, status: 'CANCELLED', company }))
          this.getState(company)
          timer(1200).subscribe(() => {
            load.dismiss();
          })
          }
        }
      ]
    });
    alert.present();
    this.onClose();
    this.router.navigate(['']);
  };
  onFinishedService = async () => {
    const alert = await this.alertCtrl.create({
      header: 'Info',
      message: 'Do you want to finished the service?',
      buttons: [
        { text: 'Cancel', role: 'cancel', handler: (blah) => {} },
        {
          text: 'OK',
          handler: async() => {
            const load = await this.loadCrtl.create({ message: 'Processing...' })
            load.present();
            this.store.dispatch(actions.updateSolicitud({ id: this.res.id, status: 'CLOSED', company: this.company }))
            this.getState(this.company);
            timer(1200).subscribe(async () => {
              load.dismiss();
              const modal = await this.modalCtrl.create({
                component: RatingModalComponent,
                componentProps: { id: this.res.id, company: this.company }
              });
              await modal.present();
            });
          }
        }
      ]
    });
    alert.present();
    this.onClose();
    this.router.navigate(['']);
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

  private getState = (id: any) => {
    this.store.dispatch(actions.closedLoad({ id }));
    this.store.dispatch(actions.loadHistory({ id }));
    this.store.dispatch(actions.loadAccepted({ id }));
    this.store.dispatch(actions.loadSolicitud({ id }));
  }
}
