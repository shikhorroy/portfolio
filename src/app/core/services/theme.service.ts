import { Injectable, effect, signal } from '@angular/core';

export type Theme = 'light' | 'dark';
const STORAGE_KEY = 'theme';

// Holds the current theme, persists the choice, and keeps <html data-theme>
// in sync. Initial value: a saved choice if there is one, else the OS setting.
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.initial());

  constructor() {
    // reflect the signal onto the document and localStorage whenever it changes
    effect(() => {
      const t = this.theme();
      document.documentElement.dataset['theme'] = t;
      // keep the mobile browser chrome (address bar) in sync with the paper color
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', t === 'dark' ? '#12161b' : '#f4f1e8');
      try {
        localStorage.setItem(STORAGE_KEY, t);
      } catch {
        // storage can throw in private mode - the theme still applies for the session
      }
    });
  }

  toggle(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  private initial(): Theme {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
