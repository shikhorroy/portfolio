import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResumeService } from '../../core/services/resume.service';
import { TttPlateComponent } from './ttt-plate.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TttPlateComponent],
  template: `
    <section id="contact" class="section">
      <div class="container contact__inner">
        <div class="contact__center">
          <p class="contact__line">
            Need to get in touch? Find me on
            @for (c of (resumeService.resume$())?.contacts; track c.label; let last = $last) {
              <a class="link-quiet" [href]="c.href" target="_blank" rel="noopener">{{ c.label }}</a>@if (!last) {<span aria-hidden="true"> &middot; </span>}
            }
          </p>

          <div class="contact__sep" aria-hidden="true"></div>

          <app-ttt-plate />
        </div>

        <footer class="footer mono">
          <span>{{ (resumeService.resume$())?.name }}</span>
          <span>&copy; {{ year }} &middot; built with Angular</span>
        </footer>
      </div>
    </section>
  `,
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  protected readonly year = new Date().getFullYear();

  constructor(protected resumeService: ResumeService) {}
}
