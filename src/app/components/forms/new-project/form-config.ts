import { HttpErrorResponse } from "@angular/common/http";
import { assertInInjectionContext, inject, Signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { debounce, required, schema, hidden, validateHttp, validateStandardSchema, validateTree, validate, validateAsync } from "@angular/forms/signals";
import { of, tap } from "rxjs";
import z from "zod";
import { messages } from "~/app/messages";
import { ProjectService } from "~/sdk/services/project/project.service";

export const NewProjectFormModel = z.object({
	name: z.string(),
	description: z.string().nullable().default(null),
	organization: z.uuid()
});
export type NewProjectFormModel = z.infer<typeof NewProjectFormModel>;

export function projectFormSchema(service: ProjectService) {
	return schema<NewProjectFormModel>(paths => {
		hidden(paths.organization, () => true);
		required(paths.name, { message: messages.requiredField });
		debounce(paths.name, 200);

		validateAsync(paths.name, {
			factory: projectNameValidatorResourceFactory(service),
			params: ({ value }) => value(),
			onError: (e) => {
				return { message: (e as HttpErrorResponse).message, kind: 'serverError' }
			},
			onSuccess: ({ available }) => {
				if (available) return null;
				return { message: messages.nameTaken, kind: 'nameTaken' }
			}
		});
	});
}

export function projectNameValidatorResourceFactory(service: ProjectService) {
	const cache = new Map<string, boolean>();
	return (name: Signal<string | undefined>) => {
		return rxResource({
			params: () => ({ name: name() }),
			stream: ({ params }) => {
				const name = params.name
				if (!name) return of({ available: true });
				if (cache.has(name)) {
					return of({ available: cache.get(name)! });
				}
				return service.isNameAvailable({ name }).pipe(
					tap(response => cache.set(name, response.available))
				);
			}
		});
	}
}
