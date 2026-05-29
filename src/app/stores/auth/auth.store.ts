import { Injectable } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { SessionDtoOfGuid } from '@datamount/sdk/models';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { concatMap, tap } from 'rxjs';
import { AuthService } from '~/sdk/services/auth/auth.service';
import { OrganizationService } from '~/sdk/services/organization/organization.service';
import { UserService } from '~/sdk/services/user/user.service';
import { Principal } from '~/types';
import { LoadPrincipal, LoadSession, SelectOrganization, SignOut } from './actions';

export type AuthStoreModel = {
	principal?: Principal;
	session?: SessionDtoOfGuid;
};
type Context = StateContext<AuthStoreModel>;

export const AUTH_STORE = new StateToken<AuthStoreModel>('auth');

@State({
	name: AUTH_STORE,
	defaults: {
		principal: Principal.parse({}),
	},
})
@Injectable()
export class AuthStore {
	private readonly userService = inject(UserService);
	private readonly authService = inject(AuthService);
	private readonly orgService = inject(OrganizationService);

	@Action(SelectOrganization, { cancelUncompleted: true })
	onSelectOrganization(ctx: Context, { id }: SelectOrganization) {
		return this.orgService.activateOrganization(id).pipe(
			concatMap(() => ctx.dispatch(LoadSession)),
		);
	}

	@Action(LoadSession, { cancelUncompleted: true })
	onLoadSession(ctx: Context) {
		return this.authService.getSession().pipe(
			tap(session => ctx.setState(patch({ session: SessionDtoOfGuid.parse(session) })))
		)
	}

	@Action(SignOut, { cancelUncompleted: true })
	onSignOut(ctx: Context) {
		return this.authService.signOut().pipe(
			tap(() => {
				ctx.setState({ principal: Principal.parse({}) });
				localStorage.removeItem('session');
				sessionStorage.removeItem('session');
			})
		);
	}

	@Action(LoadPrincipal, { cancelUncompleted: true })
	onLoadPrincipal(ctx: Context) {
		return this.userService
			.getMe()
			.pipe(
				tap((self) =>
					ctx.setState(
						patch({
							principal: Principal.parse(self),
						}),
					),
				),
			)
	}
}
