import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { rootRoutes } from './root.routes';
import { apiInterceptor } from './interceptors/api-interceptor';

// const loaders = !isDevMode() ? provideNetlifyLoader() : [];

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(rootRoutes, withViewTransitions({ skipInitialTransition: true })),
		provideHttpClient(withInterceptors([apiInterceptor])),
		// loaders
	]
};
