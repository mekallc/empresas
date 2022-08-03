import { IntegratedService } from './core/services/integrated.service';
import { Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {

  user$: any = [];
  appVersion: any = [];

  constructor(
    private platform: Platform,
    private global: Globalization,
    private store: Store<AppState>,
    private storage: StorageService,
    private pushService: PushService,
    public traslate: TraslationService,
    private token: ValidationTokenService,
    private integrated: IntegratedService,
  ) {
    this.integrated.getNetwork();
  }

  ngOnInit() {

    this.offOn();
    this.appActive();
    this.getLanguage();
    this.initializeApp();
  }

  initializeApp = () => {
    this.platform.ready().then(async () => {
      this.token.validate();
      this.integrated.initState();
      await this.pushService.initPush();
      await this.storage.getStorage('push');
      setTimeout(()=>{ SplashScreen.hide({ fadeOutDuration: 1000 }); }, 2000)
    });
  };

  appActive = () => {
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        this.integrated.initState();
        this.token.validate();
      }
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
}
