import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageService } from '../../core/services/page.service';

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
      </div>
    </header>
  `,
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  protected readonly pageService = inject(PageService);

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
