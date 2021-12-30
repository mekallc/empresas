import { selectCompanyList } from './states/selector/company.selector';
import { loadCompany } from './states/actions/company.actions';
import { ValidationTokenService } from './core/services/validation-token.service';
import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { PushService } from '@core/services/push.service';
import { StorageService } from '@core/services/storage.service';
import { TraslationService } from '@core/language/traslation.service';
import { Globalization } from '@ionic-native/globalization/ngx';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  user$: any = [];
  appVersion: any = [];
  constructor(
    private store: Store,
    private platform: Platform,
    private global: Globalization,
    private storage: StorageService,
    private pushService: PushService,
    public traslate: TraslationService,
    private token: ValidationTokenService,
  ) {
  }

  async ngOnInit() {
    this.initializeApp();
    await this.getLanguage();
    App.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) { return; }
      this.token.validate();
    });
  }

  initializeApp = () => {
    this.platform.ready().then(() => {
      this.pushService.initPush();
      this.store.dispatch(loadCompany());
      this.user$ = this.store.select(selectCompanyList);
      // this.user = await this.storage.getStorage('userCompany');
    });
  };
  getLanguage = async () => {
    const { value } = await this.global.getPreferredLanguage();
    if (value) { this.traslate.use(value.split('-')[0]); }
    else { this.traslate.use('en');}
  };
}
