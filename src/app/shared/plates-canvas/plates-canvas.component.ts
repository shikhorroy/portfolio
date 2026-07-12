import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  afterNextRender,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { PageService } from '../../core/services/page.service';
import {
  FigHelpers,
  crosshair,
  figEventStream,
  figHashRing,
  figServiceGraph,
  figTree,
  figWaveform,
} from './figures';

// Full-screen background canvas drawing the animated "plates".
// Runs outside the Angular zone; never triggers change detection.
@Component({
  selector: 'app-plates-canvas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #plates class="plates" aria-hidden="true"></canvas>`,
  styles: `
    .plates {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    }
  `,
})
export class PlatesCanvasComponent implements OnDestroy {
  private readonly canvasRef =
    viewChild.required<ElementRef<HTMLCanvasElement>>('plates');
  private readonly zone = inject(NgZone);
  private readonly pageService = inject(PageService);

  private rafId = 0;
  private cleanup: (() => void) | null = null;
  private redrawStatic: (() => void) | null = null;

  constructor() {
    afterNextRender(() => this.zone.runOutsideAngular(() => this.start()));
    // reduced-motion mode has no animation loop, so page switches redraw here
    effect(() => {
      this.pageService.page();
      this.redrawStatic?.();
    });
  }

  private start(): void {
    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) draw(12);
    };

    // Mirrors --ink / --accent from _tokens.scss
    const helpers: FigHelpers = {
      ink: (a) => `rgba(36, 50, 64, ${a})`,
      accent: (a) => `rgba(15, 110, 102, ${a})`,
      caption: (c, x, y, text) => {
        c.font = '500 10px "JetBrains Mono", monospace';
        c.fillStyle = helpers.ink(0.32);
        c.textAlign = 'center';
        c.fillText(text, x, y);
      },
    };

    // The figures are composed around the hero's centered column. On content
    // pages they would overlap text, so they drop to a faint watermark.
    let fade = 1;
    const targetFade = () => (this.pageService.page() === 'top' ? 1 : 0.12);

    const draw = (t: number) => {
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, width, height);

      const target = targetFade();
      fade += (target - fade) * 0.08;
      if (Math.abs(target - fade) < 0.005) fade = target;
      if (fade <= 0.01) return;
      ctx.globalAlpha = fade;

      crosshair(ctx, width / 2, 30, 6, helpers.ink(0.2));
      crosshair(ctx, 26, height / 2, 6, helpers.ink(0.2));
      crosshair(ctx, width - 26, height / 2, 6, helpers.ink(0.2));

      // The centered hero name grows up to ~680px wide. The corner figures sit
      // near x=156 and x=width-156, so below ~1240px the name collides with
      // them. Under that width, draw only the top + bottom figures, which stay
      // clear of the centered column.
      const compact = width < 1240;
      figEventStream(ctx, width / 2, height - 96, Math.min(360, width * 0.42), t, helpers);
      if (compact) {
        // the consistent hash ring is the default figure on narrower screens
        figHashRing(ctx, width / 2, 122, 54, t, helpers);
        return;
      }
      figWaveform(ctx, 116, height * 0.42, 70, t, helpers);
      figServiceGraph(ctx, 156, 168, t, helpers);
      figHashRing(ctx, width - 166, 178, 62, t, helpers);
      figTree(ctx, width - 156, height - 250, t, helpers);
    };

    resize();
    window.addEventListener('resize', resize);

    if (reduced) {
      this.redrawStatic = () => {
        fade = targetFade(); // no animation: snap to the page's level
        draw(12);
      };
      this.redrawStatic();
    } else {
      let startTime: number | null = null;
      const loop = (now: number) => {
        if (startTime === null) startTime = now;
        draw((now - startTime) / 1000);
        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    }

    this.cleanup = () => {
      window.removeEventListener('resize', resize);
      if (this.rafId) cancelAnimationFrame(this.rafId);
    };
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}
