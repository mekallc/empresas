import { ModalController, NavController } from '@ionic/angular';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil, map, delay } from 'rxjs/operators';
import { AppState } from '@store/app.state';
import { RegisterPage } from './../register/register.page';
import { DbCompaniesService } from './../../services/db-companies.service';

import { StorageService } from '@core/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  lists$: Observable<any>;
  load: boolean = true;

  constructor(
    private db: DbCompaniesService,
    private storage: StorageService,
    private modalCtrl: ModalController,
    private store: Store<AppState>,
    private navCtrl: NavController,
  ) {}

  ngAfterViewInit() {
    this.lists$ = this.store.select('company').pipe(
      delay(1500),
      tap((res: any) => this.load = res.loading ),
      map((res: any) => res.company),
    );
    this.lists$.subscribe((res) => console.log(res));
  }

  onEdit =  (item?: any) => {
    this.navCtrl.navigateRoot('/pages/companies/add');
    //   component: RegisterPage,
    //   componentProps: { modal: false, item: item ? item: null }
    // });
    // await modal.present();
  };
}
