import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, AlertController } from '@ionic/angular';
import { map, switchMap, tap } from 'rxjs/operators';
import { MasterService } from '@core/services/master.service';
import { StorageService } from '@core/services/storage.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Address } from '@modules/users/services/user.interface';

const { url, version, headers } = environment.api;

@Injectable({
  providedIn: 'root'
})
export class DbUserService {

  address$: BehaviorSubject<Address> = new BehaviorSubject(null);


  constructor(
    private http: HttpClient,
    private router: Router,
    private navCtrl: NavController,
    private storage: StorageService,
    private ms: MasterService,
    private alertCtrl: AlertController,
  ) { }

  // signIn = async (data: any): Promise<any> => {
  //   try {
  //     const result = await this.http.post(`${api.url}/${api.version}/setting/token/`, data, api.headers);
  //     console.log(result.data);
  //     if (!result.data || !result.data.length) { return []; }
  //     this.setStorage(result.data);
  //     this.router.navigate(['pages', 'home']);
  //     this.getTokenRefresh();
  //   } catch (err) {
  //     const error = JSON.parse(err);
  //     const alert = await this.alertCtrl.create({header: 'Error', message: error.detail });
  //     await alert.present();
  //     return err;
  //   }
  // };

  access(data: any) {
    return this.http.post(`${url}/${version}/setting/token/`, data).pipe(
      switchMap(async (res: any) => {
        await this.saveUser(res);
        await this.saveToken(res.access);
        await this.saveRefreshToken(res.refresh);
        return res;
      })
    );
  }

  registerUser(data: any) {
    return this.http.post(`${url}/${version}/user/add/`, data).pipe(
      switchMap (async (res: any) => {
        await this.storage.setStorage('user', res);
        await this.saveToken(res.token.access_token);
        await this.saveRefreshToken(res.token.refresh_token);
        return res;
      })
    );
  };

  registerCompany(data: any, token: string) {
    headers.Authorization = `Bearer ${token}`;
    return this.http.post(`${url}/${version}/user/company/add/`, data, {headers});
  };

  refreshToken(refresh: string) {
    console.log('REFRESH ', refresh);
    return this.http.post(`${url}/${version}/setting/token/refresh/`, { refresh })
      .pipe(map((res: any) => {
        console.log('ACCESS ', res);
        return res.access;
      }),
        tap(async (res: any) => await this.saveRefreshToken(res)));
  }


  saveToken = async (token: string) => {
    await this.storage.removeStorage('token');
    await this.storage.setStorage('token', token);
  };

  saveRefreshToken = async (token: string) => {
    await this.storage.removeStorage('refresh');
    await this.storage.setStorage('refresh', token);
  };

  saveUser = async (user: any) => {
    await this.storage.removeStorage('user');
    await this.storage.setStorage('user', user);
  };

  getCountries = () => this.ms.getMaster(`master/countries/`);
  getCountriesName = (name: string) => this.ms.getMaster(`master/countries/?name=${name}`);
  getCategories = () => this.ms.getMaster('master/expert/');

  setAddress$  = (items: Address) => this.address$.next(items);
  getAddress$  = (): Observable<Address> => this.address$.asObservable();


  private handle = (result: any) => {
    if (!result.data || !result.data.length) { return []; }
    return JSON.parse(result.data);
  };
}
