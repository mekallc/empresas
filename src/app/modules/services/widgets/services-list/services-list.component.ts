import { MasterService } from '@core/services/master.service';
/* eslint-disable ngrx/no-store-subscription */
import { Store } from '@ngrx/store';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { DbCompaniesService } from '@modules/companies/services/db-companies.service';
import { selectCompanyList } from 'src/app/states/selector/company.selector';
import { Observable, timer, zip } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { DbCategoriesService } from '@modules/categories/services/db-categories.service';
import { WaitingComponent } from '@modules/categories/pages/waiting/waiting.component';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
})
export class ServicesListComponent implements OnInit, AfterViewInit {

  @Input() type = 'ACCEPTED';
  items$: Observable<any[]>;
  company: any;

  constructor(
    private store: Store,
    private router: Router,
    private ms: MasterService,
    private db: DbCompaniesService,
    private db1: DbCategoriesService,
    private alertCtrl: AlertController,
    private modalCrtl: ModalController,
    private loadCrtl: LoadingController,
  ) { }

  ngOnInit() {
    this.store.select(selectCompanyList).subscribe((res: any) => {
      this.listService(res.id);
      this.company = res;
    });
  }

  ngAfterViewInit() {  }

  listService = (id: number, load?: boolean) => {
    this.items$ = zip(this.db.getServices(id), this.ms.getMaster('master/expert/')).pipe(
      map((x: any) => {
        const data = [];
        x[0].forEach(el => {
          el.expert_icon = x[1].filter((row: any) => row.name === el.type_expert)[0].picture;
          data.push(el);
        });
        return data;
      })
    );
  };

  openService = async (res: any) => {
    const modal = await this.modalCrtl.create({
      component: WaitingComponent,
      componentProps: { res }
    });
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
          text: 'Delete',
          handler: () => {
            this.db1.statusService(item.id, 'CANCELLED', this.company.id)
            .subscribe(() => this.listService(this.company.id));
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
        }, {
          text: 'Finish',
          handler: () => {
            this.db1.statusService(item.id, 'COMPLETED', this.company.id)
            .subscribe(() => this.listService(this.company.id));
          }
        }
      ]
    });
    alert.present();
  };

  acceptedService = async (item: any) => {
    const load = await this.loadCrtl.create({message: 'Proccesing...'});
    load.present();
    timer(1200).subscribe(() => {
      this.db1.statusService(item.id, 'ACCEPTED', this.company.id).subscribe(
      () => {
        load.dismiss();
      }, () => { load.dismiss(); });
      console.log(this.company.id);
      this.listService(this.company.id, true);
    });
  };
}
