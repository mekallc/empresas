import { createAction, props } from '@ngrx/store';
import { SolicitudModel } from '@core/model/solicitud.interfaces';

export const loadSolicitud = createAction(
  '[Load Solicitud] Load Solicitud Success'
);

export const loadedSolicitud = createAction(
  '[Loaded Solicitud] Loaded Solicitud Success',
  props<{ solicitud: ReadonlyArray<SolicitudModel[]> }>()
);
