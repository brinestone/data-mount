import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideHome, lucideUnlink } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';

@Component({
  selector: 'dm-not-found',
  viewProviders: [
    provideIcons({
      lucideHome,
      lucideArrowLeft,
      lucideUnlink,
    }),
  ],
  imports: [HlmEmptyImports, HlmButton, NgIcon, RouterLink],
  templateUrl: './not-found.page.html',
  styleUrl: './not-found.page.scss',
})
export class NotFoundPage {
  protected readonly location = inject(Location);
}
