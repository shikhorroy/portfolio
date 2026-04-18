import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RESUME } from '../../core/data/resume.data';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="about" class="section">
      <div class="container">
        <span class="section-eyebrow">About</span>
        <h2 class="section-title">Engineer. Builder. <span class="text-gradient">Systems thinker.</span></h2>

        <div class="about__grid">
          <div class="about__copy">
            @for (p of resume.about; track $index) {
              <p>{{ p }}</p>
            }
          </div>

          <aside class="about__card surface">
            <header class="about__card-head">
              <span class="mono about__card-kicker">// currently</span>
              <h3>{{ currentRole?.role }}</h3>
              <p class="about__card-sub">
                <span>{{ currentRole?.company }}</span>
                <span class="mono about__card-dates">{{ currentRole?.start }} - {{ currentRole?.end }}</span>
              </p>
            </header>
            <ul class="about__card-list">
              @for (h of currentHighlights; track $index) {
                <li>{{ h }}</li>
              }
            </ul>
          </aside>
        </div>
      </div>
    </section>
  `,
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  protected readonly resume = RESUME;
  protected readonly currentRole = RESUME.experience.find((e) => e.current);
  protected readonly currentHighlights = this.currentRole?.highlights.slice(0, 4) ?? [];
}
