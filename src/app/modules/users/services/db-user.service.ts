import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { NavController, AlertController } from '@ionic/angular';
import { StorageService } from '@core/services/storage.service';
import { environment } from 'src/environments/environment';

const api = environment.api;

@Injectable({
  providedIn: 'root'
})
export class DbUserService {

  constructor(
    private http: HTTP,
    private router: Router,
    private navCtrl: NavController,
    private storage: StorageService,
    private alertCtrl: AlertController,
  ) { }

  signIn = async (data: any): Promise<any> => {
    try {
      const result = await this.http.post(`${api.url}/${api.version}/setting/token/`, data, api.headers);
      console.log(result.data);
      if (!result.data || !result.data.length) { return []; }
      this.setStorage(result.data);
      this.router.navigate(['pages', 'home']);
      this.getTokenRefresh();
    } catch (err) {
      const error = JSON.parse(err);
      const alert = await this.alertCtrl.create({header: 'Error', message: error.detail });
      await alert.present();
      return err;
    }
  };

  private setStorage = async (result: any) => {
    const user = JSON.parse(result);
    await this.storage.setStorage('token', { access: user.access, refresh: user.refresh });
    delete user.access;
    delete user.refresh;
    await this.storage.setStorage('user', user);
    await this.storage.getStorage('token');
  };
  private getTokenRefresh = async (token?: string): Promise<any> => {
    try {
      if (!token) {
        const  tok = await this.storage.getStorage('token');
        token = tok.refresh;
      };
      const result = await this.http.post(`${api.url}/${api.version}/setting/token/refresh/`, { refresh: token }, api.headers);
      const user = this.handle(result);
      await this.storage.setStorage('token', user.access);
    } catch (err) {
      console.error('An error occurred loading all customers:', err);
      return [];
    }
  };
  private handle = (result: any) => {
    if (!result.data || !result.data.length) { return []; }
    return JSON.parse(result.data);
  };
}
