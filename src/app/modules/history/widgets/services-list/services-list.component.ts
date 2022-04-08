import { SolicitudModel } from '@core/model/solicitud.interfaces';
import { Component, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, timer, zip } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.state';
import { MasterService } from '@core/services/master.service';
import { WaitingComponent } from '@modules/categories/pages/waiting/waiting.component';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
})
export class ServicesListComponent implements AfterViewInit {

  items$: Observable<any>;
  solicitud$: Observable<any>;
  company: any;
  loading = true;

  constructor(
    private router: Router,
    private ms: MasterService,
    private store: Store<AppState>,
    private alertCtrl: AlertController,
    private modalCrtl: ModalController,
    private loadCrtl: LoadingController,
  ) { }


  ngAfterViewInit() {
    this.getServices();
  }

  getServices = () => {
    this.getIcone(this.getClosed());
  }

  doRefresh = (ev: any) => {
    setTimeout(() => {
      this.getServices();
      ev.target.complete()
    }, 1500);
  };

  openService = async (res: any) => {
    const modal = await this.modalCrtl.create({
      component: WaitingComponent,
      componentProps: { res }
    });
    modal.present();
  };


  private getIcone = (items$) => {
    this.ms.getMaster('master/expert/').subscribe((expert: any) => {
      this.items$ = items$.pipe(map((services: any) => this.dataIcone(services, expert)))
    });
  }
  private getClosed = () => this.store.select('history').pipe(
    filter((row) => !row.loading),
    tap((res: any) => {
      this.company = res.id;
      this.loading = res.loading
    }),
    map((res) => res.history)
  );

  private getCancel = () => this.store.select('history').pipe(
    filter((row) => !row.loading),
    tap((res: any) => {
      this.company = res.id;
      this.loading = res.loading
    }),
    filter((row) => row.status === 'CANCELLED'),
    map((res) => res.history)
  );

  private dataIcone = (services: [], expert: any) => {
    const data = [];
    services.forEach((el: any) => {
      const filter = expert.filter((row: any) => row.name === el.type_expert)[0].picture.toString();
      el.icon_expert = filter;
      data.push(el);
    });
    return data;
  }
}
