import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';

import { Login, Register } from './interfaces';
import { MasterService } from '@core/services/master.service';
import { StorageService } from 'src/app/core/services/storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private ms: MasterService,
    private navCtrl: NavController,
    private storage: StorageService,
    private alertCtrl: AlertController,
  ) { }

  /** Tokens */
  signIn(data: Login) {
    return this.ms.postMaster('setting/token/', data).pipe(
      map(async (res: any) => {
        await this.refreshUser(res);
        await this.refreshToken(res.access);
        return res;
      })
    );
  }

  signUp(data: any) {
    return this.ms.postMaster( '/user/add/', data).pipe(
      map(async (res: any) => {
        await this.refreshToken(res.token.access_token);
        delete res.token;
        await this.refreshUser(res);
        return res;
      })
    );
  }

  signOut = async () => {
    await this.storage.removeStorage('userCompany');
    await this.storage.removeStorage('tokenCompany');
    return this.navCtrl.navigateRoot('/user/signIn');
  };

  alertErr = async (message: string) => {
    const alert = await this.alertCtrl.create(
      { header: 'Error', message, buttons: ['OK'], mode:'ios'});
    await alert.present();
  };

  private refreshUser = async (user: any) => {
    await this.storage.removeStorage('userCompany');
    await this.storage.setStorage('userCompany', user);
  };

  private refreshToken = async (token: string) => {
    await this.storage.removeStorage('tokenCompany');
    await this.storage.setStorage('tokenCompany', token);
  };
}
