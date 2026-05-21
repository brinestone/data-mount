import { Injectable } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { UserDtoOfGuid } from '@civilio/sdk/models';
import { NgxsOnInit, State, StateContext, StateToken } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { tap } from 'rxjs';
import { isUserSignedIn } from '~/app/features/auth';
import { UserService } from '~/sdk/services/user/user.service';

export type AuthStoreModel = {
  principal?: UserDtoOfGuid;
};

export const AUTH_STORE = new StateToken<AuthStoreModel>('auth');

@State({
  name: AUTH_STORE,
  defaults: {},
})
@Injectable()
export class AuthStore implements NgxsOnInit {
  private readonly userService = inject(UserService);
  ngxsOnInit(ctx: StateContext<any>): void {
    const signedIn = isUserSignedIn();
    if (signedIn) {
      this.userService
        .getMe()
        .pipe(
          tap((self) =>
            ctx.setState(
              patch({
                principal: self,
              }),
            ),
          ),
        )
        .subscribe();
    }
  }
}
