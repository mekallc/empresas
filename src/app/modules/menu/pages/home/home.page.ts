import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { App } from '@capacitor/app';

import { Observable, timer } from 'rxjs';
import { StorageService } from '@core/services/storage.service';
import { PostContentsWidgetComponent } from '@modules/contents/widget/post/post.component';
import { AuthService } from '@modules/users/services/auth.service';
import { Store } from '@ngrx/store';
import { DbCompaniesService } from '@modules/companies/services/db-companies.service';
import { selectUserLoaded } from 'src/app/states/selector/user.selector';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  position: number;
  appInfo: any;
  active = true;
  content = [
    { name: 'Perfil', url: '/user/profile' },
    { name: 'Compañias', url: '/pages/companies' },
    { name: 'Mensajes', url: '/chat/soporte' },
    { name: 'Membresia', url: '' },
  ];
  subContent = [
    { name: 'Help Center', modal: true },
    { name: 'Privacy Policy', modal: true },
    { name: 'Term of Use', modal: true },
    { name: 'About Meka', modal: true },
    { name: 'Rate the App', url: '' }
  ];
  user$: Observable<any>;
  user: any;
  constructor(
    private store: Store,
    private auth: AuthService,
    private nav: NavController,
    private storage: StorageService,
    private modalCtrl: ModalController,
    private dbCompany: DbCompaniesService,
    private loadingCtrl: LoadingController,
  ) {}

  async ngOnInit() {
    const user = await this.storage.getStorage('userCompany');
    this.user = user;
    this.appInfoCapacitor();
  }

  logout = async () => {
    const load = await this.loadingCtrl.create({ message: 'Eliminando sesiones de Usuairo...', duration: 1500 });
    await load.present();
    this.auth.signOut();
  };

  appInfoCapacitor = async () => {
    const appInfo = await App.getInfo();
    this.appInfo = appInfo;
  };

  logScrolling = (ev: any) => {
    this.position = ev.detail.scrollTop;
  };

  onPost = async (title: string) => {
    const modal = await this.modalCtrl.create({ component: PostContentsWidgetComponent, componentProps: { title } });
    await modal.present();
  };

  onOffLine(id: number, active: boolean) {
    this.active = !this.active;
    this.dbCompany.statusCompany(id, active).subscribe((res) => {
      console.log(res);
    });
  }

  onLink = (url: string) => this.nav.navigateRoot(url);
}
