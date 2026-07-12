import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResumeService } from '../../core/services/resume.service';

@Component({
  selector: 'app-education',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="education" class="section section--compact">
      <div class="container">
        <header class="section-head">
          <span class="plate-eyebrow">06 - Education and Records</span>
          <h2 class="section-title">Where the fundamentals come from</h2>
          <div class="section-rule" aria-hidden="true"></div>
        </header>

        <div class="edu__grid">
          <div class="edu__block">
            <h3 class="edu__h mono">Education</h3>
            <p class="edu__line">{{ (resumeService.resume$())?.education?.degree }}</p>
            <p class="edu__line edu__line--soft">
              {{ (resumeService.resume$())?.education?.school }},
              {{ (resumeService.resume$())?.education?.location }}
            </p>
          </div>

          <div class="edu__block">
            <h3 class="edu__h mono">Competitive Programming</h3>
            @for (line of (resumeService.resume$())?.competitive; track $index) {
              <p class="edu__line edu__line--soft">
                {{ line }}
                @if ($last && (resumeService.resume$())?.competitiveLink; as link) {
                  <a class="link-quiet" [href]="link.url" target="_blank" rel="noopener">{{ link.label }}</a>
                }
              </p>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './education.component.scss',
})
export class EducationComponent {
  constructor(protected resumeService: ResumeService) {}
}
