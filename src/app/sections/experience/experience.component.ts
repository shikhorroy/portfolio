import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ResumeService } from '../../core/services/resume.service';
import { Resume } from '../../core/data/resume.data';

@Component({
  selector: 'app-experience',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="experience" class="section">
      <div class="container">
        <span class="section-eyebrow">Experience</span>
        <h2 class="section-title">A timeline of <span class="text-gradient">shipping things</span></h2>
        <p class="section-subtitle">
          {{ yrs() }}+ years of production systems - from monoliths to event-driven platforms, Dhaka to the cloud.
        </p>

        <ol class="timeline">
          @for (job of (resumeService.resume$())?.experience; track job.company + job.start; let i = $index) {
            <li class="timeline__item">
              <div class="timeline__marker" [class.timeline__marker--current]="job.current"></div>

              <article class="timeline__card surface" [class.timeline__card--open]="openIndex() === i">

                <button
                  class="timeline__head"
                  type="button"
                  [attr.aria-expanded]="openIndex() === i"
                  (click)="toggle(i)"
                >
                  <div class="timeline__head-info">
                    <h3 class="timeline__role">{{ job.role }}</h3>
                    <p class="timeline__company">
                      <span>{{ job.company }}</span>
                      <span class="timeline__dot">·</span>
                      <span class="timeline__loc">{{ job.location }}</span>
                    </p>
                  </div>

                  <div class="timeline__head-right">
                    <span class="timeline__dates mono" [class.timeline__dates--current]="job.current">
                      {{ job.start }} - {{ job.end }}
                    </span>
                    <span class="timeline__chevron" [class.timeline__chevron--open]="openIndex() === i" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </span>
                  </div>
                </button>

                <div class="timeline__body" [class.timeline__body--open]="openIndex() === i">
                  <div class="timeline__body-inner">
                    <ul class="timeline__points">
                      @for (point of job.highlights; track $index) {
                        <li>{{ point }}</li>
                      }
                    </ul>
                  </div>
                </div>

              </article>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent implements OnInit {
  protected readonly yrs = signal<number>(0);
  protected readonly openIndex = signal<number>(0);

  constructor(protected resumeService: ResumeService) {}

  ngOnInit(): void {
    this.resumeService.getResume().then((resume: Resume) => {
      const yearsMatch = resume.about[0].match(/(\d+)\+/);
      const years = yearsMatch ? parseInt(yearsMatch[1], 10) : 0;
      this.yrs.set(years);
    });
  }

  protected toggle(i: number): void {
    this.openIndex.update((current) => (current === i ? -1 : i));
  }
}
