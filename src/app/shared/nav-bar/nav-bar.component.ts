import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

interface NavLink {
  id: string;
  label: string;
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ThemeToggleComponent],
  template: `
    <header class="nav" [class.nav--scrolled]="scrolled()">
      <div class="nav__inner container">
        <a href="#top" class="nav__brand" (click)="scrollTo($event, 'top')">
          <img class="nav__brand-mark" src="logo.svg" alt="Shikhor Kumer Roy logo" width="36" height="36"/>
          <span class="nav__brand-text">
            <span class="nav__brand-name">Shikhor Kumer Roy</span>
            <span class="nav__brand-role mono">&#123; building things<span class="nav__brand-cursor">_</span>&#125;</span>
          </span>
        </a>

        <nav class="nav__links" aria-label="Primary">
          @for (link of links; track link.id) {
            <a
              class="nav__link"
              [class.nav__link--active]="active() === link.id"
              [href]="'#' + link.id"
              (click)="scrollTo($event, link.id)"
            >{{ link.label }}</a>
          }
        </nav>

        <div class="nav__actions">
          <app-theme-toggle />
        </div>
      </div>
    </header>
  `,
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements AfterViewInit, OnDestroy {
  private readonly doc = inject(DOCUMENT);

  protected readonly links: NavLink[] = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  protected readonly scrolled = signal(false);
  protected readonly active = signal<string>('about');

  private observer?: IntersectionObserver;
  private onScroll = () => this.scrolled.set(window.scrollY > 24);

  ngAfterViewInit(): void {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();

    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) this.active.set(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    for (const link of this.links) {
      const el = this.doc.getElementById(link.id);
      if (el) this.observer.observe(el);
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    this.observer?.disconnect();
  }

  protected scrollTo(event: Event, id: string): void {
    event.preventDefault();
    const target = id === 'top' ? this.doc.documentElement : this.doc.getElementById(id);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
