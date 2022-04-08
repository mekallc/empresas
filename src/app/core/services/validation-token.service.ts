import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';

import { MasterService } from '@core/services/master.service';
import { StorageService } from '@core/services/storage.service';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.state';
import { filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ValidationTokenService {

  constructor(
    private router: Router,
    private ms: MasterService,
    private store: Store<AppState>,
    private storage: StorageService,
  ) { }

  validate = async () => {
    const refresh = await this.storage.getStorage('refreshCompany');
    const access = await this.storage.getStorage('tokenCompany');
    if (access) {
      const decode: any = jwt_decode(access);
      const exp = moment().diff(moment.unix(decode.exp), 'hours');
      if (exp >= -1) { this.refreshToken(refresh); }
    }
  };

  refreshToken = (refresh: string) => {
    this.ms.postMaster('setting/token/refresh/', { refresh }).subscribe(async (res: any) => {
      await this.storage.removeStorage('tokenCompany');
      await this.storage.setStorage('tokenCompany', res.access);
    });
  };

  validateMember = () => {
    this.store.select('stripe').pipe(filter(row => !row.loading), map((res: any) => res.item))
    .subscribe((res: any) => {
      if(res) {
        if (res.triel_start > res.trial_end) {
          this.router.navigate(['/pages', 'membership', 'home']);
        }
      }
    })
  }

}
