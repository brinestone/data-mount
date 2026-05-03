import { makeEnvironmentProviders } from "@angular/core";
import { AuthService } from "../services/auth/auth.service";

export function provideAuth() {
	return makeEnvironmentProviders([
		{ provide: AuthService, multi: false }
	])
}
