import { createAction, props } from '@ngrx/store';
import { CompanyModel } from '@core/model/company.interfaces';

export const loadCompany = createAction( '[Load Company] Load Company Success' );
export const loadedCompany = createAction( '[Loaded Company] Loaded Company Success', props<{ company: ReadonlyArray<CompanyModel> }>());
