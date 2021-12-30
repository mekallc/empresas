import { SolicitudState } from '@core/model/items.state';
import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectServiceFeature = (state: AppState) => state.solicitud;

export const selectServicesList = createSelector(
  selectServiceFeature, (state: SolicitudState) => state.solicitud
);
