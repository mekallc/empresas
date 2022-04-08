import { createReducer, on } from '@ngrx/store';
import { loadCompany, loadedCompany, loadedCompanyError } from '../actions';
import { CompanyModel } from '@core/model/company.interfaces';
import { ErrorModel } from '@core/model/error.interface';

export interface CompanyState {
  company: CompanyModel[];
  loading: boolean;
}

export const companyState: CompanyState = {
  loading: false,
  company: []
};

const _companyReducer = createReducer(
  companyState,
  on(loadCompany, (state) => ({ ...state, loading: true })),

  on(loadedCompany, (state, { company }) => ({
    ...state,
    loading: false,
    company
  })),
);

export const companyReducer = (state: any, action: any) => _companyReducer(state, action);
