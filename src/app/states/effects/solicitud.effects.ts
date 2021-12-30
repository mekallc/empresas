/* eslint-disable ngrx/prefer-action-creator-in-of-type */
import { loadedCompany } from './../actions/company.actions';
import { Injectable } from '@angular/core';
import { DbCompaniesService } from '@modules/companies/services/db-companies.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class SolicitudEffects {

  getServices$ = this.actions$.pipe(
    ofType('[Load Solicitud] Load Solicitud Success'),
    switchMap((action) => {
      console.log('action ', action);
      return this.db.getServices(54).pipe(
        map(solicitud => ({ type: '[Loaded Solicitud] Loaded Solicitud Success', solicitud })),
        catchError(() => EMPTY)
      );
    }),
  );

  constructor(
    private actions$: Actions,
    private db: DbCompaniesService
  ) { }
}
