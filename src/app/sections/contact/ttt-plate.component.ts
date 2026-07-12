import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Mark = 'X' | 'O';
type Winner = Mark | 'draw' | null;

interface Score {
  x: number;
  o: number;
  draws: number;
}

const LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const SCORE_KEY = 'ttt-score';
const BOARD_KEY = 'ttt-board';

function loadScore(): Score {
  try {
    const raw = JSON.parse(localStorage.getItem(SCORE_KEY) ?? '{}');
    return { x: +raw.x || 0, o: +raw.o || 0, draws: +raw.draws || 0 };
  } catch {
    return { x: 0, o: 0, draws: 0 };
  }
}

function saveScore(score: Score): void {
  try {
    localStorage.setItem(SCORE_KEY, JSON.stringify(score));
  } catch {
    // private browsing: score just won't persist
  }
}

function loadBoard(): (Mark | null)[] {
  try {
    const raw = JSON.parse(localStorage.getItem(BOARD_KEY) ?? '[]');
    if (Array.isArray(raw) && raw.length === 9 && raw.every((c) => c === 'X' || c === 'O' || c === null)) {
      return raw;
    }
  } catch {
    // fall through to a fresh board
  }
  return Array(9).fill(null);
}

function saveBoard(board: (Mark | null)[]): void {
  try {
    localStorage.setItem(BOARD_KEY, JSON.stringify(board));
  } catch {
    // private browsing: moves just won't persist
  }
}

@Component({
  selector: 'app-ttt-plate',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ttt">
      <p class="ttt__invite">While you're here - challenge whoever's sitting next to you.</p>
      <p class="ttt__caption mono">FIG. F - TIC-TAC-TOE &middot; PEER-TO-PEER, LITERALLY</p>

      <div class="ttt__frame">
        <div class="ttt__cols mono" aria-hidden="true"><span>1</span><span>2</span><span>3</span></div>
        <div class="ttt__rows mono" aria-hidden="true"><span>A</span><span>B</span><span>C</span></div>

        <div class="ttt__board">
        @for (cell of board(); track $index; let i = $index) {
          <button
            type="button"
            class="ttt__cell"
            [disabled]="cell !== null || winner() !== null"
            [attr.aria-label]="coord(i) + ', ' + (cell ?? 'empty')"
            (click)="play(i)"
          >
            @if (cell === 'X') {
              <svg viewBox="0 0 40 40" aria-hidden="true">
                <path class="ttt__mark" d="M11 11 L29 29 M29 11 L11 29" />
              </svg>
            } @else if (cell === 'O') {
              <svg viewBox="0 0 40 40" aria-hidden="true">
                <circle class="ttt__mark" cx="20" cy="20" r="10.5" />
              </svg>
            }
          </button>
        }

        @if (winCoords(); as w) {
          <svg class="ttt__strike" viewBox="0 0 3 3" aria-hidden="true">
            <line [attr.x1]="w.x1" [attr.y1]="w.y1" [attr.x2]="w.x2" [attr.y2]="w.y2" pathLength="1" />
          </svg>
        }
        </div>
      </div>

      <p class="ttt__status mono" aria-live="polite" [class.ttt__status--win]="winner() && winner() !== 'draw'">
        {{ status() }}
      </p>

      <p class="ttt__score mono">X {{ score().x }} &middot; O {{ score().o }} &middot; DRAWS {{ score().draws }}</p>

      <div class="ttt__actions mono">
        <button type="button" class="link-quiet" (click)="restart()">Restart</button>
        <button type="button" class="link-quiet" (click)="resetScore()">Reset score</button>
      </div>
    </div>
  `,
  styleUrl: './ttt-plate.component.scss',
})
export class TttPlateComponent {
  protected readonly board = signal<(Mark | null)[]>(loadBoard());
  protected readonly turn = signal<Mark>('X');
  protected readonly winner = signal<Winner>(null);
  protected readonly winLine = signal<number[] | null>(null);
  protected readonly score = signal<Score>(loadScore());

  constructor() {
    // turn / winner / win line are all derivable from the restored marks
    // (the score was already counted when the game actually ended)
    const b = this.board();
    const line = LINES.find((l) => b[l[0]] !== null && l.every((j) => b[j] === b[l[0]]));
    if (line) {
      this.winner.set(b[line[0]]);
      this.winLine.set(line);
    } else if (b.every(Boolean)) {
      this.winner.set('draw');
    } else {
      const x = b.filter((c) => c === 'X').length;
      const o = b.filter((c) => c === 'O').length;
      this.turn.set(x === o ? 'X' : 'O');
    }
  }

  protected readonly status = computed(() => {
    const w = this.winner();
    if (w === 'draw') return 'DRAW';
    if (w) return `${w} WINS`;
    return `${this.turn()} TO MOVE`;
  });

  // strike endpoints in board units (cell centers), stretched a bit past them
  protected readonly winCoords = computed(() => {
    const l = this.winLine();
    if (!l) return null;
    const cx = (i: number) => (i % 3) + 0.5;
    const cy = (i: number) => Math.floor(i / 3) + 0.5;
    const [a, , b] = l;
    const dx = cx(b) - cx(a);
    const dy = cy(b) - cy(a);
    const stretch = 0.18 / Math.hypot(dx, dy);
    return {
      x1: cx(a) - dx * stretch,
      y1: cy(a) - dy * stretch,
      x2: cx(b) + dx * stretch,
      y2: cy(b) + dy * stretch,
    };
  });

  // grid coordinate for phone-friendly turns: rows A-C, columns 1-3 ("B2")
  protected coord(i: number): string {
    return 'ABC'[Math.floor(i / 3)] + ((i % 3) + 1);
  }

  protected play(i: number): void {
    if (this.winner() || this.board()[i]) return;
    const mark = this.turn();
    const next = [...this.board()];
    next[i] = mark;
    this.board.set(next);
    saveBoard(next);

    const line = LINES.find((l) => l.every((j) => next[j] === mark));
    if (line) {
      this.winner.set(mark);
      this.winLine.set(line);
      this.bump(mark === 'X' ? 'x' : 'o');
    } else if (next.every(Boolean)) {
      this.winner.set('draw');
      this.bump('draws');
    } else {
      this.turn.set(mark === 'X' ? 'O' : 'X');
    }
  }

  protected restart(): void {
    const empty = Array(9).fill(null);
    this.board.set(empty);
    this.turn.set('X');
    this.winner.set(null);
    this.winLine.set(null);
    saveBoard(empty);
  }

  protected resetScore(): void {
    const zero = { x: 0, o: 0, draws: 0 };
    this.score.set(zero);
    saveScore(zero);
  }

  private bump(key: keyof Score): void {
    const next = { ...this.score(), [key]: this.score()[key] + 1 };
    this.score.set(next);
    saveScore(next);
  }
}
