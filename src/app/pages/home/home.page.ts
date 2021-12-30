import { loadSolicitud } from './../../states/actions/solicitud.actions';
import { CompanyModel } from '@core/model/company.interfaces';
import { Observable } from 'rxjs';
import { selectCompanyList } from './../../states/selector/company.selector';
import { loadCompany, loadedCompany } from './../../states/actions/company.actions';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MasterService } from '@core/services/master.service';
import { StorageService } from '@core/services/storage.service';
import { DbCompaniesService } from '@modules/companies/services/db-companies.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

  company: any = [];
  company$: Observable<any> = new Observable();

  constructor(
    private store: Store,
    private companies: DbCompaniesService,
  ) {}

  ngOnInit() {
    this.store.dispatch(loadCompany());
  }

  async ngAfterViewInit() {
    this.companies.getExistCompany();
  }
  doRefresh = (event: any) => {
    this.store.dispatch(loadCompany());
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1500);
  };
}
