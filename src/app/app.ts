import { Component, DOCUMENT, effect, Inject, inject, Renderer2 } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { fromEvent, map } from 'rxjs';

const watcher = matchMedia('prefers-dark-mode');
function currentTheme(src: { matches: boolean }) {
	return src.matches ? 'dark' : 'light';
}
@Component({
	selector: 'dm-root',
	imports: [RouterOutlet],
	templateUrl: './app.html',
	styleUrl: './app.scss'
})
export class App {
	protected readonly theme = toSignal(
		fromEvent<MediaQueryListEvent>(watcher, 'change').pipe(
			map(currentTheme)
		),
		{ initialValue: currentTheme(watcher) }
	);
	// protected readonly renderer = inject(Renderer2);
	constructor(@Inject(DOCUMENT) document: Document, renderer: Renderer2) {
		effect(() => {
			const theme = this.theme();
			if (theme == 'dark') {
				renderer.addClass(document.children[0], 'dark');
			} else {
				renderer.removeClass(document.children[0], 'dark');
			}
		})
	}
}
