import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RESUME, yearsOfExperience } from '../../core/data/resume.data';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="top" class="hero">
      <div class="container hero__grid">
        <div class="hero__content">
          <h1 class="hero__title">
            <span class="hero__hello mono">// hello, world</span>
            <span class="hero__name">I'm <span class="text-gradient">{{ resume.name }}</span></span>
            <span class="hero__role">{{ resume.title }}</span>
          </h1>

          <p class="hero__tagline">{{ resume.tagline }}</p>

          <div class="hero__ctas">
            <a class="btn btn--primary" href="#contact">
              Let's talk
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            </a>
            <a class="btn btn--ghost" href="#experience">View experience</a>
          </div>

          <div class="hero__stats">
            @for (h of resume.highlights; track h.label) {
              <div class="hero__stat">
                <span class="hero__stat-value">{{ h.value }}</span>
                <span class="hero__stat-label">{{ h.label }}</span>
              </div>
            }
          </div>
        </div>

        <div class="hero__portrait">
          <div class="portrait">
            <div class="portrait__ring portrait__ring--outer"></div>
            <div class="portrait__ring portrait__ring--inner"></div>
            <div class="portrait__glow"></div>
            <div class="portrait__frame">
              <img [src]="resume.profileImage" alt="Portrait of {{ resume.name }}" loading="eager"/>
            </div>
            <span class="portrait__tag portrait__tag--tl mono">&#123; java &#125;</span>
            <span class="portrait__tag portrait__tag--tr mono">kotlin.kt</span>
            <span class="portrait__tag portrait__tag--br mono">// {{ yrs }}+ yrs</span>
            <span class="portrait__tag portrait__tag--bl mono">&#64;problem solver</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  protected readonly resume = RESUME;
  protected readonly yrs = yearsOfExperience();
}
