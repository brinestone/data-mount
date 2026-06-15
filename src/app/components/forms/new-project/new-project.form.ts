import { Component, inject, input, linkedSignal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { ProjectService } from '~/sdk/services/project/project.service';
import { NewProjectFormModel, projectFormSchema } from './form-config';

@Component({
	selector: 'dm-new-project',
	imports: [
		FormField,
		FormRoot
	],
	templateUrl: './new-project.form.html',
	styleUrl: './new-project.form.scss',
})
export class NewProjectForm {
	readonly organization = input.required<string>();
	protected readonly formData = linkedSignal(() => NewProjectFormModel.parse({ organization: this.organization() }));
	protected readonly formModel = form(this.formData, projectFormSchema(inject(ProjectService)));
}
