import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { appRoutes } from './app.routes';
import { apiInterceptor } from './interceptors/api-interceptor';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(appRoutes, withViewTransitions({ skipInitialTransition: true })),
		provideHttpClient(withInterceptors([apiInterceptor]))
	]
};
