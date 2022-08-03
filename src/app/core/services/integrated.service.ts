import { AlertController, NavController } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Storage } from '@capacitor/storage';

import * as actions from '@store/actions';
import { AppState } from '@store/app.state';
import { StorageService } from '@core/services/storage.service';
import { Router } from '@angular/router';
import { MasterService } from '@core/services/master.service';


@Injectable({
  providedIn: 'root'
})
export class IntegratedService {

  constructor(
    private store: Store<AppState>,
    private storage: StorageService,
    private router: Router,
    private nav: NavController,
    private alertCtrl: AlertController,
    private ms: MasterService,
  ) { }

  initState = () => {
    this.store.dispatch(actions.expertLoad());
    this.store.dispatch(actions.loadCompany());
    this.store.dispatch(actions.positionLoad())
    this.store.select('company')
    .pipe(filter(row => !row.loading), map(res => res.company))
    .subscribe((res: any) => {
      if(res) {
        const id = res.id;
        this.store.dispatch(actions.closedLoad({ id} ));
        this.store.dispatch(actions.loadSolicitud({ id }));
        this.store.dispatch(actions.loadAccepted({ id }));
        this.store.dispatch(actions.loadHistory({ id }));
      } else {
        this.onPushCompany();
      }
    })
  };

  onSync = () => {};

  onPushCompany = () => {
    this.nav.setDirection('root');
    this.nav.navigateRoot('register-company');
  };

  getNetwork = () => {
    this.ms.getMasterObserve('master/types-companies/')
    .subscribe(res => {
      console.log(res);
    },
    err => {
      console.log(err);
    })
  };
}
