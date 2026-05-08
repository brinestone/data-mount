import { Component, DOCUMENT, effect, Inject, inject, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './features/themeing/theme.service';
import { Meta } from '@angular/platform-browser';
@Component({
	selector: 'dm-root',
	imports: [RouterOutlet],
	template: `<router-outlet/>`,
	styleUrl: './app.scss'
})
export class App {
	protected readonly theme = inject(ThemeService).themeSignal;
	constructor(@Inject(DOCUMENT) private readonly document: Document,
		renderer: Renderer2, private readonly meta: Meta) {
		effect(() => {
			const theme = this.theme();
			if (theme == 'dark') {
				renderer.addClass(document.documentElement, 'dark');
			} else {
				renderer.removeClass(document.documentElement, 'dark');
			}
			this.updateThemeColor();
		});
		this.updateThemeColor();
	}

	private updateThemeColor() {
		const styles = getComputedStyle(this.document.documentElement);
		const colorValue = styles.getPropertyValue('--primary').trim();

		if (colorValue) {
			this.meta.updateTag({ name: 'theme-color', content: colorValue });
		}
	}
}
