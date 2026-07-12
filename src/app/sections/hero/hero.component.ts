import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ResumeService } from '../../core/services/resume.service';
import { PageService } from '../../core/services/page.service';

// The one word of the tagline rendered in accent teal.
const ACCENT_WORD = 'data-intensive';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="top" class="hero">
      <div class="container hero__inner">
        <h1 class="hero__name">{{ (resumeService.resume$())?.name }}</h1>

        <p class="hero__meta mono">
          {{ (resumeService.resume$())?.title }} &middot; {{ (resumeService.resume$())?.location }}
        </p>

        <div class="rule-dot hero__rule" aria-hidden="true"></div>

        <p class="hero__tagline">
          {{ taglineParts().before }}@if (taglineParts().accent) {<em>{{ taglineParts().accent }}</em>}{{ taglineParts().after }}
        </p>

        <div class="hero__links mono">
          <a class="link-quiet" href="#experience" (click)="go($event, 'experience')">View experience</a>
          <a class="link-quiet" href="#contact" (click)="go($event, 'contact')">Get in touch</a>
        </div>
      </div>
    </section>
  `,
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  private readonly pageService = inject(PageService);

  protected go(event: Event, id: string): void {
    event.preventDefault();
    this.pageService.page.set(id);
  }

  protected readonly taglineParts = computed(() => {
    const tagline = this.resumeService.resume$()?.tagline ?? '';
    const idx = tagline.indexOf(ACCENT_WORD);
    if (idx === -1) return { before: tagline, accent: '', after: '' };
    return {
      before: tagline.slice(0, idx),
      accent: ACCENT_WORD,
      after: tagline.slice(idx + ACCENT_WORD.length),
    };
  });

  constructor(protected resumeService: ResumeService) {}
}
