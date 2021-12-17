import { NavController, ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { NotificationsComponent } from '@core/widgets/notifications/notifications.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title: string;
  @Input() link: string;
  @Input() position = 'end';
  content = 0;

  constructor(
    private nav: NavController,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  onNotification = async () => {
    const modal = await this.modalCtrl.create({ component: NotificationsComponent });
    await modal.present();
  };

  onMenu = (item: string) => this.nav.navigateRoot(item);
}
