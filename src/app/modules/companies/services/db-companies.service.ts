import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterService } from '@core/services/master.service';
import { StorageService } from '@core/services/storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const { headers } = environment.api;

@Injectable({
  providedIn: 'root'
})
export class DbCompaniesService {

  token: string;
  address$: BehaviorSubject<Address> = new BehaviorSubject(null);
  constructor(
    private ms: MasterService,
    private storage: StorageService,
  ) {
    this.storage.getStorage('token').then((res) => this.token = res);
  }

  getCompanies = () => this.ms.getMaster('user/company/');

  getCountries = () => this.ms.getMaster(`master/countries/`);
  getCountriesName = (name: string) => this.ms.getMaster(`master/countries/?name=${name}`);
  getCategories = () => this.ms.getMaster('master/expert/');
  registerCompany(data: any, token: string) {
    return this.ms.postMaster('user/company/add/', data);
  };

  setAddress$  = (items: Address) => this.address$.next(items);
  getAddress$  = (): Observable<Address> => this.address$.asObservable();
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
