/* eslint-disable ngrx/on-function-explicit-return-type */
import { createReducer, on } from '@ngrx/store';
import { UserState } from '@core/model/items.state';
import { loadUser, loadedUser } from 'src/app/states/actions/user.actions';

export const initialState: UserState = { loading: false, user: [] };

export const userReducer = createReducer(
  initialState,
  on(loadUser, (state) => ({ ...state, loading: true })),
  on(loadedUser, (state, { user }) => ({ ...state, loading: false, user }))
);
