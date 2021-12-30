import { SolicitudModel } from './solicitud.interfaces';
import { CompanyModel } from './company.interfaces';
import { UserModel } from '@core/model/user.interfaces';

export interface CompanyState {
  loading: boolean;
  company: ReadonlyArray<CompanyModel>;
}

export interface SolicitudState {
  loading: boolean;
  solicitud: ReadonlyArray<SolicitudModel[]>;
}

export interface UserState {
  loading: boolean;
  user: ReadonlyArray<UserModel>;
}
