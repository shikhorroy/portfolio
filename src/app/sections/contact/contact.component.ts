import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { RESUME, type ContactLink } from '../../core/data/resume.data';

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="contact" class="section">
      <div class="container">
        <div class="contact__card surface">
          <div class="contact__copy">
            <span class="section-eyebrow">Let's connect</span>
            <h2 class="section-title">Say <span class="text-gradient">hello</span></h2>
            <p class="contact__desc">
              I'm always happy to connect with fellow engineers, swap ideas, or just talk tech.
              Find me on LinkedIn or shoot me an email - I read everything.
            </p>

            <a class="btn btn--primary" [href]="emailHref">
              Send me an email
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16v16H4zM4 4l8 8 8-8"/>
              </svg>
            </a>
          </div>

          <ul class="contact__links">
            @for (c of resume.contacts; track c.label) {
              <li>
                <a class="contact__item" [href]="c.href" [attr.target]="isExternal(c) ? '_blank' : null" rel="noopener">
                  <span class="contact__icon" aria-hidden="true" [innerHTML]="iconSvg(c.icon)"></span>
                  <span class="contact__text">
                    <span class="contact__label">{{ c.label }}</span>
                    <span class="contact__value mono">{{ c.value }}</span>
                  </span>
                  <span class="contact__arrow" aria-hidden="true">→</span>
                </a>
              </li>
            }
          </ul>
        </div>

        <footer class="footer">
          <span class="mono">© {{ year }} {{ resume.name }} · built with Angular</span>
          <span class="mono footer__hint">theme toggle top-right ·  no cookies</span>
        </footer>
      </div>
    </section>
  `,
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly resume = RESUME;
  protected readonly year = new Date().getFullYear();
  protected readonly emailHref =
    RESUME.contacts.find((c) => c.icon === 'mail')?.href ?? 'mailto:';

  protected isExternal(c: ContactLink): boolean {
    return c.href.startsWith('http');
  }

  protected iconSvg(name: ContactLink['icon']): SafeHtml {
    const stroke = 'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
    const open = `<svg viewBox="0 0 24 24" fill="none" ${stroke}>`;
    const close = `</svg>`;
    const paths: Record<ContactLink['icon'], string> = {
      mail: `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/>`,
      phone: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.13.93.37 1.84.72 2.72a2 2 0 0 1-.45 2.11L8.1 9.82a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.88.35 1.79.59 2.72.72A2 2 0 0 1 22 16.92z"/>`,
      linkedin: `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-13h4v2a6 6 0 0 1 2-2"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>`,
      youtube: `<path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>`,
      link: `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>`,
      github: `<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>`,
    };
    return this.sanitizer.bypassSecurityTrustHtml(`${open}${paths[name]}${close}`);
  }
}
