import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RESUME } from '../../core/data/resume.data';

@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="projects" class="section">
      <div class="container">
        <span class="section-eyebrow">Selected work</span>
        <h2 class="section-title">Things I've <span class="text-gradient">built & shared</span></h2>
        <p class="section-subtitle">
          Internal tools, plugins, and a YouTube channel - small surfaces where I get to sharpen the craft.
        </p>

        <div class="projects__grid">
          @for (p of resume.projects; track p.name) {
            <article class="projects__card surface">
              <div class="projects__top">
                <div class="projects__glyph" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </svg>
                </div>
                <h3 class="projects__name">{{ p.name }}</h3>
              </div>
              <p class="projects__desc">{{ p.description }}</p>

              <div class="projects__tags">
                @for (t of p.tags; track t) {
                  <span class="chip">{{ t }}</span>
                }
              </div>

              @if (p.link) {
                <a class="projects__link" [href]="p.link.url" target="_blank" rel="noopener">
                  {{ p.link.label }}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7 17L17 7M9 7h8v8"/>
                  </svg>
                </a>
              }
            </article>
          }
        </div>

        <aside class="cp-card surface">
          <div class="cp-card__head">
            <span class="section-eyebrow">Competitive programming</span>
            <h3>Sharpening algorithms at the edge</h3>
          </div>
          <ul class="cp-card__list">
            @for (line of resume.competitive; track $index) {
              <li>{{ line }}
                @if ($last) {
                  <a [href]="resume.competitiveLink.url" target="_blank" rel="noopener">{{ resume.competitiveLink.label }}</a>
                }
              </li>
            }
          </ul>
        </aside>
      </div>
    </section>
  `,
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  protected readonly resume = RESUME;
}
