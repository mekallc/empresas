import { createAction, props } from '@ngrx/store';
import { SolicitudModel } from '@core/model/solicitud.interfaces';

export const loadHistory= createAction(
  '[HISTORY] Load',
  props< { id: number }>()
);

export const loadedHistory = createAction(
  '[HISTORY]  Success',
  props<{ history: SolicitudModel[] }>()
);
