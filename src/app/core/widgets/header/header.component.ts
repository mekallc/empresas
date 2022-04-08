import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { NotificationsComponent } from '@core/widgets/notifications/notifications.component';
import { SolicitudModalComponent } from '@core/widgets/solicitud-modal/solicitud-modal.component';
import { Observable } from 'rxjs';
import { AppState } from '@store/app.state';
import { Store } from '@ngrx/store';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit {

  @Input() title: string;
  @Input() link: string;
  @Input() position = 'end';
  @Input() services = [];
  content = 0;

  count$: Observable<any>;

  constructor(
    private nav: NavController,
    private store: Store<AppState>,
    private modalCtrl: ModalController,
  ) { }

  ngAfterViewInit(){
    this.count$ = this.store.select('solicitud')
    .pipe( filter(row => !row.loading ), map((res: any) => res.total) );
  }

  onNotification = async () => {
    const modal = await this.modalCtrl.create({ component: NotificationsComponent });
    await modal.present();
  };

  onSolicitud = async () => {
    const modal = await this.modalCtrl.create({ component: SolicitudModalComponent });
    await modal.present();
  };

  onMenu = (item: string) => this.nav.navigateRoot(item);
}
