/* eslint-disable ngrx/on-function-explicit-return-type */
import { createReducer, on } from '@ngrx/store';
import { CompanyState } from '@core/model/items.state';
import { loadCompany, loadedCompany } from './../actions/company.actions';

export const initialState: CompanyState = { loading: false, company: [] };

export const companyReducer = createReducer(
  initialState,
  on(loadCompany, (state) => ({ ...state, loading: true })),
  on(loadedCompany, (state, { company }) => ({ ...state, loading: false, company }))
);
