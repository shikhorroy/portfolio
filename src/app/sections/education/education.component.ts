import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RESUME } from '../../core/data/resume.data';

@Component({
  selector: 'app-education',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="education" class="section section--compact">
      <div class="container">
        <span class="section-eyebrow">Education</span>

        <article class="edu surface">
          <div class="edu__cap" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 10L12 4 2 10l10 6 10-6z"/>
              <path d="M6 12v5c3 2 9 2 12 0v-5"/>
            </svg>
          </div>
          <div class="edu__body">
            <h3>{{ resume.education.degree }}</h3>
            <p class="edu__school">{{ resume.education.school }}</p>
            <p class="edu__meta mono">{{ resume.education.location }}</p>
          </div>
        </article>
      </div>
    </section>
  `,
  styleUrl: './education.component.scss',
})
export class EducationComponent {
  protected readonly resume = RESUME;
}
