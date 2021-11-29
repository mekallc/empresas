import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterService } from '@core/services/master.service';
import { StorageService } from '@core/services/storage.service';
import { environment } from 'src/environments/environment';

const { headers } = environment.api;

@Injectable({
  providedIn: 'root'
})
export class DbCompaniesService {

  token: string;
  constructor(
    private ms: MasterService,
    private storage: StorageService,
  ) {
    this.storage.getStorage('token').then((res) => this.token = res);
  }

  getCompanies() {
    return this.ms.getMasterHeaders('user/company');
  }
}
