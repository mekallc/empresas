import { loadUser } from './../../../states/actions/user.actions';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';

import { Login, Register } from './interfaces';
import { MasterService } from '@core/services/master.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { timer } from 'rxjs';
import { Store } from '@ngrx/store';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private store: Store,
    private router: Router,
    private ms: MasterService,
    private navCtrl: NavController,
    private storage: StorageService,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
  ) { }

  /** Tokens */
  signIn(data: Login) {
    return this.ms.postMaster('setting/token/', data).pipe(
      map(async (res: any) => {
        this.store.dispatch(loadUser());
        await this.refreshAccessToken(res.access);
        await this.refreshRefreshToken(res.refresh);
        delete res.access;
        delete res.refresh;
        await this.refreshUser(res);
        return res;
      })
    );
  }

  signUp(data: any) {
    return this.ms.postMaster( '/user/add/', data).pipe(
      map(async (res: any) => {
        await this.refreshAccessToken(res.token.access_token);
        await this.refreshRefreshToken(res.refresh);
        await this.refreshUser(res);
        return res;
      })
    );
  }

  signOut = async () => {
    const load = await this.loadCtrl.create({duration: 2000, message: 'Deleting registered information...'});
    await this.storage.removeStorage('userCompany');
    await this.storage.removeStorage('tokenCompany');
    await this.storage.removeStorage('refreshCompany');
    await load.present();
    timer(1800).subscribe(() => this.navCtrl.navigateRoot('/user/signIn'));
  };

  updateUser(data: any) {
    if (data.phone.length === 0) { delete data.phone; }
    if (data.country.length === 0) { delete data.country; }
    if (data.fist_name.length === 0) { delete data.fist_name; }
    if (data.last_name.length === 0) { delete data.last_name; }
    console.log(data);
    return this.ms.patchMaster(`user/upd/`, data);
  }

  getUser() {
    return this.ms.getMaster('user/');
  }

  alertErr = async (message: string) => {
    const alert = await this.alertCtrl.create(
      { header: 'Error', message, buttons: ['OK'], mode:'ios'});
    await alert.present();
  };

  private refreshUser = async (user: any) => {
    await this.storage.removeStorage('userCompany');
    await this.storage.setStorage('userCompany', user);
  };

  private refreshAccessToken = async (token: string) => {
    await this.storage.removeStorage('tokenCompany');
    await this.storage.setStorage('tokenCompany', token);
  };

  private refreshRefreshToken = async (refresh: string) => {
    await this.storage.removeStorage('refreshCompany');
    await this.storage.setStorage('refreshCompany', refresh);
  };
}
