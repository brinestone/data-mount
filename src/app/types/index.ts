export type Strict<T> = {
	[P in keyof T]-?: T[P] extends (infer U)[]
	? Strict<U>[]
	: T[P] extends object | null | undefined
	? Strict<NonNullable<T[P]>>
	: NonNullable<T[P]>;
};

export type RemoteValidationErrors<T> = {
	type?: string;
	title: string;
	status: number;
	traceId?: string;
	errors: T;
}

export type EmailSignUpValidationErrors = RemoteValidationErrors<{
	Email?: string[];
	Password?: string[];
	ConfirmPassword?: string[];
}>;

export type EmailSignInValidationErrors = RemoteValidationErrors<{
	Email?: string[];
	Password?: string[];
}>;
