import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { App } from '@capacitor/app';
import { Globalization } from '@ionic-native/globalization/ngx';
import { SplashScreen } from '@capacitor/splash-screen';

import { loadCompany } from '@store/actions';
import { PushService } from '@core/services/push.service';
import { loadStatus } from '@store/actions/status.actions';
import { StorageService } from '@core/services/storage.service';
import { TraslationService } from '@core/language/traslation.service';
import { ConnectService } from '@modules/chat/services/connect.service';
import { ValidationTokenService } from '@core/services/validation-token.service';

import { AppState } from '@store/app.state';
import * as actions from '@store/actions';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {

  user$: any = [];
  appVersion: any = [];

  constructor(
    private platform: Platform,
    private global: Globalization,
    private store: Store<AppState>,
    private storage: StorageService,
    private pushService: PushService,
    public traslate: TraslationService,
    private chatService: ConnectService,
    private token: ValidationTokenService,
  ) {
  }

  ngOnInit() {
    this.offOn();
    this.token.validate();
    this.initializeApp();
    App.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) { return; }
      this.token.validate();
    });
    this.getLanguage();
  }

  ngAfterViewInit(): void { }

  initializeApp = () => {
    console.log('initialize');
    this.platform.ready().then(async () => {
      await this.pushService.initPush();
      this.getState();
      const push = await this.storage.getStorage('push');
      console.log('GET PUSH ', push);
      setTimeout(()=>{ SplashScreen.hide({ fadeOutDuration: 1000 }); }, 2000)
    });
  };
  getLanguage = async () => {
    const { value } = await this.global.getPreferredLanguage();
    if (value) { this.traslate.use(value.split('-')[0]); }
    else { this.traslate.use('en');}
  };

  offOn = async () => {
    const active = await this.storage.getStorage('status');
    if (!active) {
      await this.storage.setStorage('status', false);
      this.store.dispatch(loadStatus({ id: false }));
    } else {
      this.store.dispatch(loadStatus({ id: active }));
    }
  }

  private getState = () => {
    this.store.dispatch(loadCompany());
    this.store.select('company')
    .pipe(filter((row: any) => !row.loading), map((res: any) => res.company))
    .subscribe((res: any) => {
      if (res) {
        const id = res.id;
        this.chatService.createRoomUserChat(res)
        this.store.dispatch(actions.closedLoad({ id} ));
        this.store.dispatch(actions.loadSolicitud({ id }));
        this.store.dispatch(actions.loadAccepted({ id }));
        this.store.dispatch(actions.loadHistory({ id }));
      }
    });
  }
}
