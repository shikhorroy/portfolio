import { TestBed } from '@angular/core/testing';
import { PlatesCanvasComponent } from './plates-canvas.component';

describe('PlatesCanvasComponent', () => {
  it('creates a sized canvas and destroys cleanly', async () => {
    await TestBed.configureTestingModule({
      imports: [PlatesCanvasComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(PlatesCanvasComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const canvas: HTMLCanvasElement | null =
      fixture.nativeElement.querySelector('canvas');
    expect(canvas).toBeTruthy();
    expect(canvas!.width).toBeGreaterThan(0);
    expect(canvas!.getAttribute('aria-hidden')).toBe('true');

    expect(() => fixture.destroy()).not.toThrow();
  });
});
