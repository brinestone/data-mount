import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { provideStore } from '@ngxs/store';
import { apiInterceptor } from './interceptors/api-interceptor';
import { rootRoutes } from './root.routes';
import { AuthStore } from './stores/auth/auth.store';
import { provideUsers } from '~/sdk/providers';

// const loaders = !isDevMode() ? provideNetlifyLoader() : [];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(rootRoutes, withViewTransitions({ skipInitialTransition: true })),
    provideHttpClient(withInterceptors([apiInterceptor])),
    provideStore(
      [AuthStore],
      provideUsers(),
      withNgxsLoggerPlugin({
        disabled: !isDevMode(),
      }),
    ),
  ],
};
