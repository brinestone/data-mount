import { createPropertySelectors, createSelector } from '@ngxs/store';
import { AUTH_STORE } from './auth/auth.store';

const authSlices = createPropertySelectors(AUTH_STORE);

export const principal = authSlices.principal;

export const activeOrganization = createSelector([authSlices.session], (session) => {
	return session?.activeOrganizationId;
});
