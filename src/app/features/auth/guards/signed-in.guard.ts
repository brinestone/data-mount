import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const signedInGuard: (redirect: string) => CanActivateFn = redirect => (_, state) => {
	const router = inject(Router);

	return router.createUrlTree([redirect], { queryParams: { 'continue': encodeURIComponent(state.url) } });
}
