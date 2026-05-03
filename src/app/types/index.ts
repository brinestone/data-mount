export type Strict<T> = {
	[P in keyof T]-?: T[P] extends (infer U)[]
	? Strict<U>[]
	: T[P] extends object | null | undefined
	? Strict<NonNullable<T[P]>>
	: NonNullable<T[P]>;
};

export type EmailSignUpValidationErrors = {
	type?: string;
	title: string;
	status: number;
	errors: {
		Email?: string[];
		Password?: string[];
		ConfirmPassword?: string[];
	};
	traceId?: string;
}
