import { Injectable, OnDestroy } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MasterService } from '@core/services/master.service';
import { StorageService } from '@core/services/storage.service';
import { AuthService } from '@modules/users/services/auth.service';
import { RegisterPage } from '@modules/companies/pages/register/register.page';

const { headers } = environment.api;

@Injectable({
  providedIn: 'root'
})
export class DbCompaniesService implements OnDestroy{

  token: string;
  public company: any = [];
  address$: BehaviorSubject<Address> = new BehaviorSubject(null);
  private unsubscribe$ = new Subject<void>();

  constructor(
    private ms: MasterService,
    private storage: StorageService,
    private userService: AuthService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
  ) {
    // eslint-disable-next-line ngrx/no-store-subscription
    this.storage.getStorage('token').then((res) => this.token = res);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getCompanies = () => this.ms.getMaster('user/company/');
  getType = () => this.ms.getMaster('master/types-companies/');
  getCountries = () => this.ms.getMaster(`master/countries/`);
  getCountriesName = (name: string) => this.ms.getMaster(`master/countries/?name=${name}`);
  getCategories = () => this.ms.getMaster('master/expert/');
  registerCompany = (data: any) => this.ms.postMaster('user/company/add/', data);
  setAddress$  = (items: any) => this.address$.next(items);
  getAddress$  = (): Observable<Address> => this.address$.asObservable();

  getExistCompany = async () => {
    const com = await this.storage.getStorage('company');
    if (!com) {
      this.ms.getMaster('user/company/').pipe(takeUntil(this.unsubscribe$), map(res => res[0]))
      .subscribe(async (res: any) => {
        if (res) { await this.storage.setStorage('company', res); }
        else { this.modalData(); }
      });
    }
  };

  updateCompany = (id, data: any): Observable<Object> =>
    this.ms.patchMaster(`user/company/${id}/`, data);

  getServices(id: number, status='ACCEPTED') {
    return this.ms.getMaster(`service/company/list/?company=${id}&ordering=-date_reg&search=${status}`)
      .pipe(
        map((res: any) => res.search));
  }

  statusCompany(id: any, is_available=true) {
    return this.ms.patchMaster(`user/company/${id}/`, { is_available });
  }
  private modalData = async () => {
    const alert = await this.alertCtrl.create({
      header: 'Info',
      message: 'There are no registered companies, please create your company',
      backdropDismiss: false,
      cssClass: 'alert-backgroundDimmiss',
      buttons: [
        {
          text: 'Cancel', role: 'cancel',
          handler: (blah) => this.userService.signOut()
        },
        {
        text: 'Create Company',
        handler: async () => {
          await (await this.modalCtrl.create(
            { component: RegisterPage, componentProps: { modal: true } }
          )).present();
        }
        }
      ]
    });
    await alert.present();
  };
}

export interface Address {
  zip: string;
  num: string;
  city: string;
  state: string;
  street: string;
  country: string;
  district: string;
  latitude: string;
  longitude: string;
}
