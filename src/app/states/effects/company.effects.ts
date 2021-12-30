import { Injectable } from '@angular/core';
import { DbCompaniesService } from '@modules/companies/services/db-companies.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { SolicitudEffects } from 'src/app/states/effects/solicitud.effects';

@Injectable()
export class CompanyEffects {

  loadMovies$ = createEffect(() =>
    // eslint-disable-next-line ngrx/prefer-effect-callback-in-block-statement
    this.actions$.pipe(
      // eslint-disable-next-line ngrx/prefer-action-creator-in-of-type
      ofType('[Load Company] Load Company Success'),
      mergeMap(() => this.db.getCompanies()
        .pipe(
          map(company => ({ type: '[Loaded Company] Loaded Company Success', company: company[0] })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private db: DbCompaniesService,
    private seffects: SolicitudEffects,
  ) {}
}
