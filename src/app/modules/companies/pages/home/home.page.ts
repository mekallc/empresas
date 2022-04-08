import { ModalController } from '@ionic/angular';
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
    private store: Store<AppState>
  ) {}

  ngAfterViewInit() {
    this.lists$ = this.store.select('company').pipe(
      delay(1500),
      tap((res: any) => this.load = res.loading ),
      map((res: any) => res.company),
    );
    this.lists$.subscribe((res) => console.log(res));
  }

  onRegister = async () => {
    const modal = await this.modalCtrl.create({
      component: RegisterPage,
      componentProps: { modal: true }
    });
    await modal.present();
  };
}
