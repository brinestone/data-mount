import { makeEnvironmentProviders } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { ProjectService } from '../services/project/project.service';
import { OrganizationService } from '../services/organization/organization.service';

export function provideAuth() {
	return makeEnvironmentProviders([{ provide: AuthService, multi: false }, { provide: OrganizationService, multi: false }]);
}

export function provideUsers() {
	return makeEnvironmentProviders([{ provide: UserService, multi: false }]);
}

export function provideProjects() {
	return makeEnvironmentProviders([{ provide: ProjectService, multi: false }]);
}
