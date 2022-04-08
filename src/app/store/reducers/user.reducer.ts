import { createReducer, on } from '@ngrx/store';
import { loadUser, loadedUser } from '../actions';
import { UserModel } from '@core/model/user.interface';

export interface UserState {
  user: UserModel[];
  loading: boolean;
}

export const userState: UserState = {
  loading: false,
  user: []
};

const _userReducer = createReducer(
  userState,
  on(loadUser, (state, { email, pass }) => ({ ...state, loading: true, email, pass })),

  on(loadedUser, (state, { user }) => ({ ...state, loading: false, user })),
);

export const userReducer = (state: any, action: any) => _userReducer(state, action);
