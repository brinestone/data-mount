import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
	if (req.url.startsWith("/api")) {
		const router = inject(Router);
		const newUrl = new URL(req.urlWithParams, environment.apiBase);
		const clonedRequest = req.clone({
			setHeaders: {
				'x-api-version': environment.targetVersion,
			}, url: newUrl.toString(), withCredentials: true
		});
		return next(clonedRequest).pipe(
			catchError((e: HttpErrorResponse) => {
				if (e.status == 401) {
					localStorage.clear();
					sessionStorage.clear();
					router.navigate([], { onSameUrlNavigation: 'reload' })
				}
				return throwError(() => e);
			})
		);
	}
	return next(req);
}
