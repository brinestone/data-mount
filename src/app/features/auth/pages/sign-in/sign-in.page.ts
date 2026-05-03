import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: 'dm-sign-in-page',
	templateUrl: './sign-in.page.html',
	styleUrl: './sign-in.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: []
})
export class SignInPage {
	private readonly router = inject(Router);

}
