import { LoadingController, NavController } from '@ionic/angular';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { StorageService } from '@core/services/storage.service';

import { timer } from 'rxjs';

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
    { name: 'Perfil', url: '' },
    { name: 'Compañias', url: '/pages/companies' },
    { name: 'Mensajes', url: '/pages/chat/soporte' },
    { name: 'Membresia', url: '' },
];
  subContent = ['Central de Ayuda', 'Política de Privacidad', 'Terminos de Uso', 'Sobre Meka', 'Evalua App'];

  user: any;
  constructor(
    private nav: NavController,
    private storage: StorageService,
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
    await this.storage.removeStorage('user');
    await this.storage.removeStorage('token');
    await this.storage.removeStorage('refresh');
    timer(1500).subscribe(() => this.nav.navigateRoot('/user/sign-in'));
  };

  appInfoCapacitor = async () => {
    const appInfo = await App.getInfo();
    this.appInfo = appInfo;
  };

  logScrolling = (ev: any) => {
    this.position = ev.detail.scrollTop;
  };
}
