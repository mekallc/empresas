/* eslint-disable @typescript-eslint/naming-convention */
import { UserState } from './../core/model/items.state';
import { ActionReducerMap } from '@ngrx/store';
import { CompanyState, SolicitudState } from '@core/model/items.state';
import { userReducer } from './reducers/user.reducer';
import { companyReducer } from './reducers/company.reducer';
import { solicitudReducer } from './reducers/solicitud.reducer';


export interface AppState {
  company: CompanyState;
  solicitud: SolicitudState;
  user: UserState;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  company: companyReducer,
  solicitud: solicitudReducer,
  user: userReducer,
};
