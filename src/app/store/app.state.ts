/* eslint-disable @typescript-eslint/naming-convention */
import { ActionReducerMap } from '@ngrx/store';
import * as reducers from 'src/app/store/reducers';


export interface AppState {
  user: reducers.UserState;
  closed: reducers.ClosedState;
  status: reducers.StatusState;
  expert: reducers.ExpertState;
  stripe: reducers.StripeState;
  company: reducers.CompanyState;
  history: reducers.HistoryState;
  accepted: reducers.AcceptedState;
  customer: reducers.CustomerState;
  position: reducers.PositionState;
  solicitud: reducers.SolicitudState;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  user: reducers.userReducer,
  closed: reducers.closedReducer,
  status: reducers.statusReducer,
  expert: reducers.expertReducer,
  stripe: reducers.stripeReducer,
  company: reducers.companyReducer,
  history: reducers.historyReducer,
  accepted: reducers.acceptedReducer,
  customer: reducers.customerReducer,
  position: reducers.positionReducer,
  solicitud: reducers.solicitudReducer,
};
