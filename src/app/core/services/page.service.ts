import { Injectable, effect, signal } from '@angular/core';

const PAGES = ['top', 'about', 'platform', 'experience', 'skills', 'projects', 'education', 'contact'];

function pageFromHash(): string {
  const id = location.hash.slice(1);
  return PAGES.includes(id) ? id : 'top';
}

// The single visible page; only explicit clicks (nav, hero links) change it.
// The URL hash mirrors it, so reloads and shared links restore the page and
// the browser's back/forward buttons walk the visited pages.
@Injectable({ providedIn: 'root' })
export class PageService {
  readonly page = signal(pageFromHash());

  constructor() {
    effect(() => {
      const id = this.page();
      const hash = id === 'top' ? '' : `#${id}`;
      if (location.hash !== hash) {
        if (hash) {
          location.hash = hash; // adds a history entry per page visit
        } else {
          history.pushState(null, '', location.pathname + location.search);
        }
      }
    });

    window.addEventListener('hashchange', () => this.page.set(pageFromHash()));
  }
}
