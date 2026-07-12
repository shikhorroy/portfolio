import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResumeService } from '../../core/services/resume.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="skills" class="section">
      <div class="container">
        <header class="section-head">
          <span class="plate-eyebrow">04 - Skills</span>
          <h2 class="section-title">Technologies I build with</h2>
          <div class="section-rule" aria-hidden="true"></div>
        </header>

        <dl class="skills__index">
          @for (g of (resumeService.resume$())?.skills; track g.label) {
            <div class="skills__row">
              <dt class="skills__group mono">{{ g.label }}</dt>
              <dd class="skills__items">{{ g.items.join(', ') }}</dd>
            </div>
          }
        </dl>
      </div>
    </section>
  `,
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  constructor(protected resumeService: ResumeService) {}
}
