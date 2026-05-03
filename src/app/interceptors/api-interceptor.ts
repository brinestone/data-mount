import { HttpInterceptorFn } from "@angular/common/http";
import { environment } from "../../environments/environment";

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
	if (req.url.startsWith("/api")) {
		const newUrl = new URL(req.urlWithParams, environment.apiBase);
		const clonedRequest = req.clone({ url: newUrl.toString() });
		return next(clonedRequest);
	}
	return next(req);
}
