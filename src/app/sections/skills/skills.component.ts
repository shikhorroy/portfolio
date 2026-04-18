import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RESUME } from '../../core/data/resume.data';

const CATEGORY_COLORS: Record<string, string> = {
  'Backend & Languages':   '#22d3ee',
  'Event-Driven & Data':   '#a855f7',
  'Databases & Storage':   '#34d399',
  'Cloud & DevOps':        '#f472b6',
  'Observability & Quality':'#fbbf24',
  'Frontend':              '#60a5fa',
};

@Component({
  selector: 'app-skills',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="skills" class="section">
      <div class="container">
        <span class="section-eyebrow">Toolbelt</span>
        <h2 class="section-title">Technologies I <span class="text-gradient">build with</span></h2>

        <!-- Category filter tabs -->
        <div class="skills-tabs" role="tablist" aria-label="Filter skills by category">
          <button
            class="skills-tab"
            role="tab"
            [class.skills-tab--active]="activeCategory() === null"
            (click)="setCategory(null)">
            All
            <span class="skills-tab__count">{{ allCount }}</span>
          </button>

          @for (g of groups; track g.label) {
            <button
              class="skills-tab"
              role="tab"
              [class.skills-tab--active]="activeCategory() === g.label"
              [style.--tab-color]="g.color"
              (click)="setCategory(g.label)">
              <span class="skills-tab__dot" [style.background]="g.color"></span>
              {{ g.label }}
              <span class="skills-tab__count">{{ g.count }}</span>
            </button>
          }
        </div>

        <!-- Chip grid -->
        <div class="skills-grid">
          @for (chip of visibleChips(); track chip.label) {
            <span
              class="skill-chip"
              [class.skill-chip--muted]="activeCategory() !== null && chip.category !== activeCategory()"
              [style.--chip-color]="chip.color">
              <span class="skill-chip__dot"></span>
              {{ chip.label }}
            </span>
          }
        </div>

      </div>
    </section>
  `,
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  protected readonly activeCategory = signal<string | null>(null);

  protected readonly groups = RESUME.skills.map((g) => ({
    label: g.label,
    color: CATEGORY_COLORS[g.label] ?? '#22d3ee',
    count: g.items.length,
  }));

  protected readonly allCount = RESUME.skills.reduce((n, g) => n + g.items.length, 0);

  protected readonly visibleChips = computed(() =>
    RESUME.skills.flatMap((g) =>
      g.items.map((item) => ({
        label: item,
        category: g.label,
        color: CATEGORY_COLORS[g.label] ?? '#22d3ee',
      })),
    ),
  );

  protected setCategory(cat: string | null): void {
    this.activeCategory.set(cat);
  }
}
