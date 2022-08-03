import { Component, Input, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, timer } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.state';
import { MasterService } from '@core/services/master.service';
import { updateSolicitud, loadSolicitud } from 'src/app/store/actions';
import { WaitingComponent } from '@modules/categories/pages/waiting/waiting.component';
import { DbCategoriesService } from '@modules/categories/services/db-categories.service';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    this.getServices(changes.type.currentValue);
  }

  getServices = (type: any) => {
    switch(type){
      case 'IN_PROCESS':
        this.getInProcess();
        break;
      case 'CLOSED':
        this.getClosed();
        break;
      case 'ACCEPTED':
        this.getAccepted();
        break;
      default:
    }
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

  getAccepted = () => {
    this.items$ = this.store.select('accepted')
    .pipe(
      filter((row) => !row.loading),
      tap((res: any) => { this.company = res.id; this.load = res.loading }),
      map((res) => res.accepted),
      map((res: any) => {
        const data: any = [];
        res.forEach((el: any) => {
          el.icon = this.getIcone(el.type_expert);
          data.push(el);
        });
        return data;
      })
    );
  };


  getInProcess = () => {
    this.items$ = this.store.select('solicitud')
    .pipe(
      filter((row) => !row.loading),
      tap((res: any) => { this.company = res.id; this.load = res.loading  }),
      map((res) => res.solicitud),
      map((res: any) => {
        const data: any = [];
        res.forEach((el: any) => {
          el.icon = this.getIcone(el.type_expert);
          data.push(el);
        });
        return data;
      })
    );
  };

  getClosed = () => {
    this.items$ = this.store.select('closed')
    .pipe(
      filter((row) => !row.loading),
      tap((res: any) => { this.company = res.id; this.load = res.loading }),
      map((res) => res.items),
      map((res: any) => {
        const data: any = [];
        res.forEach((el: any) => {
          el.icon = this.getIcone(el.type_expert);
          data.push(el);
        });
        return data;
      })
    );
  };

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

  getIcone = (item: any) =>{
    let data: string;
    const expert$ = this.store.select('expert')
    .pipe(
      filter((row) => !row.loading),
      map((res) => res.items),
      map((res: any) => {
        const fill: any = res.filter(data => data.name === item)[0].picture.toString();
        return fill;
      })
    );
    expert$.subscribe(res => data = res);
    return data;
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
