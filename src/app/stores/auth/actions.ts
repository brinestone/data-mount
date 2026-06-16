const prefix = '[Auth]';

export class LoadPrincipal {
	static readonly type = `${prefix} Load Principal`;
}

export class LoadSession {
	static readonly type = `${prefix} Load Session`;
}

export class SignOut {
	static readonly type = `${prefix} Sign Out`;
}

export class SignedOut{
	static readonly type = `${prefix} signed out`
}

export class SelectOrganization {
	static readonly type = `${prefix} Select Organization`;
	constructor(public readonly id: string) { }
}
