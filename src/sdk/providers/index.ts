import { makeEnvironmentProviders } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';

export function provideAuth() {
  return makeEnvironmentProviders([{ provide: AuthService, multi: false }]);
}

export function provideUsers() {
  return makeEnvironmentProviders([{ provide: UserService, multi: false }]);
}
