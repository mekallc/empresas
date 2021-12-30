import { UserState } from '@core/model/items.state';
import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectUser = (state: AppState) => state.user;

export const selectUserLoaded = createSelector(
  selectUser,
  (state: UserState) => state.user
);

