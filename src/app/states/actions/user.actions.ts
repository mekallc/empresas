/* eslint-disable ngrx/good-action-hygiene */
import { createAction, props } from '@ngrx/store';
import { UserModel } from '@core/model/user.interfaces';

export const loadUser = createAction( '[Load User]' );
export const loadedUser = createAction( '[List User]', props<{ user: ReadonlyArray<UserModel> }>());
