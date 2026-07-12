import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResumeService } from '../../core/services/resume.service';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="about" class="section">
      <div class="container">
        <header class="section-head">
          <span class="plate-eyebrow">01 - About</span>
          <h2 class="section-title">Engineer. Builder. Systems thinker.</h2>
          <div class="section-rule" aria-hidden="true"></div>
        </header>

        <div class="about__grid">
          <div class="about__copy">
            @for (p of (resumeService.resume$())?.about; track $index) {
              <p>{{ p }}</p>
            }
          </div>

          <aside class="about__specs mono" aria-label="Key facts">
            @for (h of (resumeService.resume$())?.highlights; track h.label) {
              <div class="about__spec">
                <span class="about__spec-label">{{ h.label }}</span>
                <span class="about__spec-value">{{ h.value }}</span>
              </div>
            }
            <div class="about__spec">
              <span class="about__spec-label">Location</span>
              <span class="about__spec-value">{{ (resumeService.resume$())?.location }}</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  `,
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  constructor(protected resumeService: ResumeService) {}
}
