import { CompanyState } from '@core/model/items.state';
import { createSelector } from '@ngrx/store';
import { AppState } from './../app.state';

export const selectCompanyFeature = (state: AppState) => state.company;

export const selectCompanyList = createSelector(
  selectCompanyFeature,
  (state: CompanyState) => state.company
);

