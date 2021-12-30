/* eslint-disable ngrx/on-function-explicit-return-type */
import { createReducer, on, State } from '@ngrx/store';
import { SolicitudState } from '@core/model/items.state';
import { loadSolicitud, loadedSolicitud } from '../actions/solicitud.actions';

export const initialState: SolicitudState = { loading: false, solicitud: [] };

export const solicitudReducer = createReducer(
  initialState,
  on(loadSolicitud, (state) => ({ ...state, loading: true })),
  on(loadedSolicitud, (state, { solicitud }) => ({ ...state, loading: false, solicitud }))
);
