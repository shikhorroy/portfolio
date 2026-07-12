import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ResumeService } from '../../core/services/resume.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="experience" class="section">
      <div class="container container--wide">
        <header class="section-head">
          <span class="plate-eyebrow">03 - Experience</span>
          <h2 class="section-title">A record of shipping things</h2>
          <div class="section-rule" aria-hidden="true"></div>
        </header>

        <div class="xp">
          <nav class="xp__nav" aria-label="Roles">
            @for (job of jobs(); track job.company + job.start; let i = $index) {
              <button
                type="button"
                class="xp__stop"
                [class.xp__stop--active]="i === selected()"
                [class.xp__stop--current]="job.current"
                [attr.aria-current]="i === selected() ? 'true' : null"
                (click)="selected.set(i)"
              >
                <span class="xp__stop-co">{{ job.company }}</span>
                <span class="xp__stop-dates mono">{{ job.start }} - {{ job.end }}</span>
              </button>
            }
          </nav>

          <div class="xp__detail" aria-live="polite">
            @for (job of [current()]; track selected()) {
              @if (job) {
                <article class="xp__card">
                  <header class="xp__head">
                    <div>
                      <h3 class="xp__role">{{ job.role }}</h3>
                      <p class="xp__org">{{ job.company }} &middot; {{ job.location }}</p>
                    </div>
                    <span class="xp__dates mono">{{ job.start }} - {{ job.end }}</span>
                  </header>

                  <ul class="xp__points">
                    @for (point of job.highlights; track $index) {
                      <li>{{ point }}</li>
                    }
                  </ul>
                </article>
              }
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent {
  protected readonly selected = signal(0);
  protected readonly jobs = computed(() => this.resumeService.resume$()?.experience ?? []);
  protected readonly current = computed(() => this.jobs()[this.selected()] ?? null);

  constructor(protected resumeService: ResumeService) {}
}
