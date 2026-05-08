import { CanActivateFn, Router } from "@angular/router";
import { isUserSignedIn } from "../utils";
import { inject } from "@angular/core";

export const anonymousGuard: (redirect: string) => CanActivateFn = redirect => (_, state) => {
	const isSignedIn = isUserSignedIn();
	if (!isSignedIn) return true;
	const router = inject(Router);
	return router.createUrlTree([redirect]);
}
