import { Injectable } from '@angular/core';
import { HistoryService } from '@modules/history/services/history.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as historyActions from '../actions/history.actions';

@Injectable()
export class HistoryEffects {
  history$ = createEffect(() =>
    this.actions$.pipe(
      ofType(historyActions.loadHistory),
      mergeMap((action: any) => this.db.getHistory(action.id)
        .pipe(
          map((history) => historyActions.loadedHistory({ history })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private db: HistoryService,
  ) {}

}
