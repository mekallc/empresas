import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { App } from '@capacitor/app';

import { Observable } from 'rxjs';
import { StorageService } from '@core/services/storage.service';
import { PostContentsWidgetComponent } from '@modules/contents/widget/post/post.component';
import { AuthService } from '@modules/users/services/auth.service';
import { Store } from '@ngrx/store';
import * as actions from '@store/actions';
import { DbCompaniesService } from '@modules/companies/services/db-companies.service';
import { AppState } from 'src/app/store/app.state';
import { filter, map, tap } from 'rxjs/operators';
import * as MemberPage from '@modules/membership/pages/home/home.page';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit, AfterViewInit {

  position: number;
  appInfo: any;
  content = [
    { name: 'Perfil', url: '/user/profile' },
    { name: 'Compañia', url: '/pages/companies' },
    { name: 'Mensajes', url: '/chat/soporte' }
  ];
  subContent = [
    { name: 'Privacy Policy', modal: true },
    { name: 'Term of Use', modal: true },
    { name: 'About Meka', modal: true }
  ];
  user$: Observable<any>;
  count$: Observable<number>;
  active: boolean;
  user: any;
  company: any = [];

  company$: Observable<any>;
  ts: string = '';

  constructor(
    private auth: AuthService,
    private nav: NavController,
    private store: Store<AppState>,
    private storage: StorageService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
  ) {}

  async ngOnInit() {
    this.getUser();
    const user = await this.storage.getStorage('userCompany');
    this.user = user;
    this.store.dispatch(actions.customerLoad({ email: user.email }))
    this.appInfoCapacitor();
  }

  ngAfterViewInit() {
    this.statusOnOff();
    this.countClosedJobs();
  }

  getUser = () => {
    this.company$ = this.store.select('company')
    .pipe(
      filter(row => !row.loading),
      tap((res: any) => this.getName(res.company.name)),
      map(res => res.company)
    );
    this.company$.subscribe(res => console.log('COMPANY ', res));
  };

  goToMembresia = async(): Promise<void> => {
    const modal = await this.modalCtrl.create({
      component: MemberPage.HomePage,
      mode: 'ios',
      initialBreakpoint: 1,
      breakpoints: [0, .5, .85, 1]
    });
    modal.present();
  };

  countClosedJobs = () => {
    this.count$ = this.store.select('closed')
    .pipe(filter(row => !row.loading), map((res: any) => res.total));
  }

  statusOnOff = async () => {
    this.active = await this.storage.getStorage('status');
    if (!this.active) {
      await this.storage.setStorage('status', false);
      this.store.dispatch(actions.loadStatus({ id: false }));
    }
    this.active = await this.storage.getStorage('status');
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

  logScrolling = (ev: any) => this.position = ev.detail.scrollTop;

  onPost = async (title: string) => {
    const modal = await this.modalCtrl.create({ component: PostContentsWidgetComponent, componentProps: { title } });
    await modal.present();
  };

  onOffLine = async () => {
    console.log(this.active);
    await this.storage.setStorage('status', this.active);
    this.store.dispatch(actions.loadStatus({ id: this.active }));
  };

  getName = (name: string) => {
    let value = '';
    const split = name.split(' ');
    const a = split[0].slice(0,1);
    if (!split[1]) {
      value = a;
    } else {
      const b = split[1].slice(0,1);
      value = a+b;
    }
    this.ts = value;
  };

  onLink = (url: string) => this.nav.navigateRoot(url);
}
