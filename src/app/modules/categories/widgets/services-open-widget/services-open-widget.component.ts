import { filter } from 'rxjs/operators';
/* eslint-disable ngrx/no-store-subscription */
import { Component, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from 'src/app/store/app.state';
import { DbCompaniesService } from '@modules/companies/services/db-companies.service';
import { WaitingComponent } from '@modules/categories/pages/waiting/waiting.component';
import { map, tap } from 'rxjs/operators';
import { ConnectService } from '@modules/chat/services/connect.service';

@Component({
  selector: 'app-services-open-widget',
  templateUrl: './services-open-widget.component.html',
  styleUrls: ['./services-open-widget.component.scss'],
})

export class ServicesOpenWidgetComponent implements AfterViewInit {

  options = { freeMode: true, spaceBetween: 10, slidesPerView: 2.1,  };
  items$: Observable<any>;
  loading = true;
  company: number;

  constructor(
    private store: Store<AppState>,
    private modalCtrl: ModalController,
  ) { }

  ngAfterViewInit(): void {
    this.items$ = this.store.select('solicitud').pipe(
      filter((row) => !row.loading), tap((res: any) => this.company = res.id), map((res) => res.solicitud)
    );
  }

  openModal = async (res: any, company: number) => {
    const modal = await this.modalCtrl.create({
      component: WaitingComponent,
      componentProps: { res, company },
      mode: 'ios',
      initialBreakpoint: 1,
      breakpoints: [0, 1]
    });
    await modal.present();
  };
}
