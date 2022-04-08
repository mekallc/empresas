import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as companyActions from '../actions/company.actions';
import { DbCompaniesService } from '@modules/companies/services/db-companies.service';



@Injectable()
export class CompanyEffects {

  constructor(
    private actions$: Actions,
    private db: DbCompaniesService
  ) {}

  company$ = createEffect(() =>
  this.actions$.pipe(
    ofType(companyActions.loadCompany),
    mergeMap(() => this.db.getCompanies()
      .pipe(
        map((company) => companyActions.loadedCompany({ company: company[0] })),
        catchError(() => EMPTY)
      )
    )
  )
);
}
