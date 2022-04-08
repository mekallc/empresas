import { createReducer, on } from '@ngrx/store';
import { loadedHistory, loadHistory } from '../actions';
import { SolicitudModel } from '@core/model/solicitud.interfaces';

export interface HistoryState {
  history: SolicitudModel[];
  loading: boolean;
}

export const historyState: HistoryState = {
  loading: false,
  history: []
};

const _historyReducer = createReducer(
  historyState,
  on(loadHistory, (state, { id }) => ({ ...state, loading: true, id })),

  on(loadedHistory, (state, { history }) => ({
    ...state,
    loading: false,
    history
  })),
);

export const historyReducer = (state: any, action: any) => _historyReducer(state, action);
