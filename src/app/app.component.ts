import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { PushService } from '@core/services/push.service';
import { StorageService } from '@core/services/storage.service';
import { TraslationService } from '@core/language/traslation.service';
import { Globalization } from '@ionic-native/globalization/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  user: any = [];
  appVersion: any = [];
  constructor(
    private platform: Platform,
    private global: Globalization,
    private storage: StorageService,
    private pushService: PushService,
    public traslate: TraslationService,
  ) {
  }

  async ngOnInit() {
    this.initializeApp();
    await this.getLanguage();
  }

  initializeApp = () => {
    this.platform.ready().then(async () => {
      // this.toSplash();
      this.pushService.initPush();
      this.appVersion = await App.getInfo();
      this.user = await this.storage.getStorage('userCompany');
    });
  };
  getLanguage = async () => {
    const { value } = await this.global.getPreferredLanguage();
    if (value) { this.traslate.use(value.split('-')[0]); }
    else { this.traslate.use('en');}
  };
}
