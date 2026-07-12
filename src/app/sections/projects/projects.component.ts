import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResumeService } from '../../core/services/resume.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="projects" class="section">
      <div class="container">
        <header class="section-head">
          <span class="plate-eyebrow">05 - Selected Work</span>
          <h2 class="section-title">Things I've built and shared</h2>
          <div class="section-rule" aria-hidden="true"></div>
        </header>

        <div class="projects__grid">
          @for (p of (resumeService.resume$())?.projects; track p.name; let i = $index) {
            <article class="plate projects__plate">
              <span class="plate-eyebrow">Fig. 0{{ i + 1 }}</span>
              <h3 class="projects__name">{{ p.name }}</h3>
              <p class="projects__desc">{{ p.description }}</p>
              <p class="projects__tags mono">{{ p.tags.join(' / ') }}</p>
              @if (p.link) {
                <a class="link-quiet projects__link" [href]="p.link.url" target="_blank" rel="noopener">
                  {{ p.link.label }}
                </a>
              }
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  constructor(protected resumeService: ResumeService) {}
}
