import { Component, Input, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, timer, zip, combineLatest, concat } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.state';
import { MasterService } from '@core/services/master.service';
import { SolicitudModel } from '@core/model/solicitud.interfaces';
import { loadCompany, updateSolicitud, loadSolicitud } from 'src/app/store/actions';
import { WaitingComponent } from '@modules/categories/pages/waiting/waiting.component';
import { DbCategoriesService } from '@modules/categories/services/db-categories.service';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
})

export class ServicesListComponent implements AfterViewInit, OnChanges {

  @Input() type = 'ACCEPTED';

  items$: Observable<any[]>;
  solicitud$: Observable<any>;

  load = true;
  company: any;
  offline: boolean;
  public expert: any = [];

  constructor(
    private router: Router,
    private ms: MasterService,
    private store: Store<AppState>,
    private db: DbCategoriesService,
    private alertCtrl: AlertController,
    private modalCrtl: ModalController,
    private loadCrtl: LoadingController,
  ) { }

  ngAfterViewInit() {
    this.getServices(this.type);
    this.store.select('status').subscribe((res: any) => this.offline = res.id);
    this.db.getServices(54).subscribe((res: any) => {
      console.log(res);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.type);
    console.log(changes.type.currentValue);
    this.getServices(this.type);
  }

  getServices = (type: any) => {
    if (type === 'INPROCESS') { this.getIcone(this.getInProcess()); }
    else if(type === 'CLOSED') { this.getIcone(this.getClosed()); }
    else { this.getIcone(this.getAccepted()); }
  }

  openService = async (res: any) => {
    const modal = await this.modalCrtl.create({
      component: WaitingComponent, componentProps: { res, company: this.company } });
    modal.present();
  };

  chat = (item: any) => this.router.navigate(['chat', 'room', item]);
  cancelService = async (item: any) => {
    const alert = await this.alertCtrl.create({
      header: 'Info',
      message: 'Do you want to cancel the service?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel', role: 'cancel',
          cssClass: 'secondary', handler: () => {}
        }, {
          text: 'OK',
          handler: async() => {
            const load = await this.loadCrtl.create({message: 'Proccesing...'});
            load.present();
            this.store.dispatch(updateSolicitud({ id: item.id, status: 'CANCELLED', company: this.company }))
            timer(1200).subscribe(() => {
              this.store.dispatch(loadSolicitud({ id: this.company }));
              this.getServices(this.type);
            })
            load.dismiss();
          }
        }
      ]
    });
    alert.present();
  };

  finishService = async (item: any) => {
    const alert = await this.alertCtrl.create({
      header: 'Info',
      message: 'Do you finish to the service?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel', role: 'cancel',
          cssClass: 'secondary', handler: () => {}
        },
        { text: 'Finish', }
      ]
    });
    alert.present();
  };

  acceptedService = async (item: any) => {
    const load = await this.loadCrtl.create({message: 'Proccesing...'});
    load.present();
    this.store.dispatch(updateSolicitud({ id: item.id, status: 'ACCEPTED', company: this.company }))
    timer(1200).subscribe(() => {
      this.store.dispatch(loadSolicitud({ id: this.company }))
      this.getServices(this.type);
      load.dismiss();
    });
  };

  identify = (index, item) => item.code;

  private getIcone = (items$) => {
    this.ms.getMaster('master/expert/').subscribe((expert: any) => {
      this.items$ = items$.pipe(map((services: any) => this.dataIcone(services, expert)))
    });
  }
  private getAccepted = () => this.store.select('accepted')
  .pipe(
    filter((row) => !row.loading),
    tap((res: any) => { this.company = res.id; this.load = res.loading }),
    map((res) => res.accepted)
  );

  private getInProcess = () => this.store.select('solicitud')
  .pipe(
    filter((row) => !row.loading),
    tap((res: any) => { this.company = res.id; this.load = res.loading  }),
    map((res) => res.solicitud)
  );

  private getClosed = () => this.store.select('closed')
  .pipe(
    filter((row) => !row.loading),
    tap((res: any) => { this.company = res.id; this.load = res.loading }),
    map((res) => res.items)
  );

  private dataIcone = (service: any, expert: any) => {
    if(expert) {
      const data = [];
      service.forEach((el) => {
        const filter: any = expert?.filter((row: any) => row.name === el.type_expert)[0].picture.toString();
        el.icon_expert = filter;
        data.push(el);
      });
      return data;
    }
  }

  private findIcon = (type: string) => {
    const expert$: Observable<string> = this.store.select('expert')
    .pipe(
      filter(row => !row.loading),
      map(({ items }) => items.filter((row: any) => row.type_expert)[0].picture.toString())
    );
    expert$.subscribe(console.log);
    return expert$;
  }
}
