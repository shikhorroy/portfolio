import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageService } from '../../core/services/page.service';
import { ThemeService } from '../../core/services/theme.service';

interface NavLink {
  id: string;
  label: string;
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="nav">
      <div class="nav__inner container container--wide">
        <a href="#top" class="nav__brand" (click)="go($event, 'top')">Shikhor Kumer Roy</a>

        <div class="nav__right">
          <nav class="nav__links" aria-label="Primary">
            @for (link of links; track link.id; let i = $index) {
              <a
                class="nav__link mono"
                [class.nav__link--active]="pageService.page() === link.id"
                [href]="'#' + link.id"
                [attr.aria-label]="link.label"
                (click)="go($event, link.id)"
              ><span class="nav__num">0{{ i + 1 }}</span><span class="nav__label"> {{ link.label }}</span></a>
            }
          </nav>

          <button
            class="nav__theme"
            type="button"
            (click)="themeService.toggle()"
            [attr.aria-label]="themeService.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
            title="Toggle theme"
          >
            @if (themeService.theme() === 'dark') {
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19" />
              </svg>
            } @else {
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            }
          </button>
        </div>
      </div>
    </header>
  `,
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  protected readonly pageService = inject(PageService);
  protected readonly themeService = inject(ThemeService);

  protected readonly links: NavLink[] = [
    { id: 'about', label: 'About' },
    { id: 'platform', label: 'System' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ];

  protected go(event: Event, id: string): void {
    event.preventDefault();
    this.pageService.page.set(id);
  }
}
