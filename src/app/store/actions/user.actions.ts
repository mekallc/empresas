/* eslint-disable ngrx/good-action-hygiene */
import { createAction, props } from '@ngrx/store';
import { UserModel } from '@core/model/user.interface';

export const loadUser = createAction(
  '[User] Load',
  props< { email: string, pass: string }>()
);

export const loadedUser = createAction(
  '[User] Loaded',
  props<{ user: UserModel[] }>()
);
