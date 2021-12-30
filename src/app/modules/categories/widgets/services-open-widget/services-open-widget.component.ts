/* eslint-disable ngrx/no-store-subscription */
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { selectCompanyList } from 'src/app/states/selector/company.selector';
import { WaitingComponent } from './../../pages/waiting/waiting.component';
import { DbCompaniesService } from '@modules/companies/services/db-companies.service';

@Component({
  selector: 'app-services-open-widget',
  templateUrl: './services-open-widget.component.html',
  styleUrls: ['./services-open-widget.component.scss'],
})
export class ServicesOpenWidgetComponent implements OnInit, AfterViewInit {

  options = {
    slidesPerView: 2.1,
    spaceBetween: 10,
    freeMode: true
  };

  items$: Observable<any[]>;

  constructor(
    private store: Store,
    private db: DbCompaniesService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.store.select(selectCompanyList).subscribe((res: any) => this.items$ = this.db.getServices(res.id));
  }

  openModal = async (res: any) => {
    const modal = await this.modalCtrl.create({
      component: WaitingComponent, componentProps: { res } });
    await modal.present();
  };
}
