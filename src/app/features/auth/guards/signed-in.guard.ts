import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { isUserSignedIn } from "../utils";

export const signedInGuard: (redirect: string) => CanActivateFn = redirect => (_, state) => {
	const router = inject(Router);

	const tree = router.createUrlTree([redirect], { queryParams: { 'continue': encodeURIComponent(state.url) } });
	const isSignedIn = isUserSignedIn();
	return isSignedIn ? true : tree;
}
