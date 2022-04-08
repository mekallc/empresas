import { createAction, props } from '@ngrx/store';
import { ErrorModel } from '@core/model/error.interface';
import { CompanyModel } from '@core/model/company.interfaces';

export const loadCompany = createAction( '[COMPANY] Load' );

export const loadedCompany = createAction(
  '[COMPANY] Success',
  props<{ company: CompanyModel[] }>()
);

export const loadedCompanyError = createAction(
  '[COMPANY] Error',
  props<{ payload: ErrorModel[] }>()
);
