import { inject, Injectable, OnDestroy, OnInit } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { Meta } from "@angular/platform-browser";
import { fromEvent, map } from "rxjs";

const watcher = window.matchMedia('(prefers-color-scheme: dark)');
function currentTheme(src: { matches: boolean }) {
	return src.matches ? 'dark' : 'light';
}

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnInit {
	public themeSignal = toSignal(
		fromEvent<MediaQueryListEvent>(watcher, 'change').pipe(
			takeUntilDestroyed(),
			map(currentTheme)
		),
		{ initialValue: currentTheme(watcher) }
	);
	get themeSnapshot() {
		return currentTheme(watcher);
	}

	ngOnInit(){

	}
}
