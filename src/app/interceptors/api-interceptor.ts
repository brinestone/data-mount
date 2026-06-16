import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Store } from "@ngxs/store";
import { catchError, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { SignedOut } from "../stores/auth/actions";

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
	if (req.url.startsWith("/api")) {
		// const router = inject(Router);
		const store = inject(Store);
		const newUrl = new URL(req.urlWithParams, environment.apiBase);
		const clonedRequest = req.clone({
			setHeaders: {
				'x-api-version': environment.targetVersion,
			}, url: newUrl.toString(), withCredentials: true
		});
		return next(clonedRequest).pipe(
			catchError((e: HttpErrorResponse) => {
				if (e.status == 401) {
					store.dispatch(new SignedOut());
				}
				return throwError(() => e);
			})
		);
	}
	return next(req);
}
