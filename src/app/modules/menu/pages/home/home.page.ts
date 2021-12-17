import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { StorageService } from '@core/services/storage.service';

import { timer } from 'rxjs';
import { PostContentsWidgetComponent } from '@modules/contents/widget/post/post.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

  position: number;
  appInfo: any;
  active = true;
  content = [
    { name: 'Perfil', url: '/user/profile' },
    { name: 'Compañias', url: '/pages/companies' },
    { name: 'Mensajes', url: '/pages/chat/soporte' },
    { name: 'Membresia', url: '' },
  ];
  subContent = [
    { name: 'Help Center', modal: true },
    { name: 'Privacy Policy', modal: true },
    { name: 'Term of Use', modal: true },
    { name: 'About Meka', modal: true },
    { name: 'Rate the App', url: '' }
  ];

  user: any;
  constructor(
    private nav: NavController,
    private storage: StorageService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
  ) {}

  async ngOnInit() {
    const user = await this.storage.getStorage('user');
    this.user = user;
    this.appInfoCapacitor();
  }

  ngAfterViewInit = async () => {
  };

  logout = async () => {
    const load = await this.loadingCtrl.create({
      message: 'Eliminando sesiones de Usuairo...',
      duration: 1500
    });
    await load.present();
    await this.storage.removeStorage('userCompany');
    await this.storage.removeStorage('tokenCompany');
    await this.storage.removeStorage('refresh');
    timer(1500).subscribe(() => this.nav.navigateRoot('/user/signIn'));
  };

  appInfoCapacitor = async () => {
    const appInfo = await App.getInfo();
    this.appInfo = appInfo;
  };

  logScrolling = (ev: any) => {
    this.position = ev.detail.scrollTop;
  };

  onPost = async (title: string) => {
    const modal = await this.modalCtrl.create({
      component: PostContentsWidgetComponent,
      componentProps: { title }
    });
    await modal.present();
  };

  onLink = (url: string) => this.nav.navigateRoot(url);
}
