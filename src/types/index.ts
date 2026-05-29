import { UserDtoOfGuid } from "@datamount/sdk/models";
import z from "zod";

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

export const Principal = UserDtoOfGuid.pick({
	initials: true,
	fullName: true,
	isBanned: true,
	isOnboarded: true,
	banReason: true,
	photo: true,
}).extend({
	fullName: z.string().default($localize`Unknown User`),
	initials: z.string().default('U'),
	photo: z.string().nullish().default(null),
});
export type Principal = z.infer<typeof Principal>;
