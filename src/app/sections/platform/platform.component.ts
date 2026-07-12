import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {PageService} from '../../core/services/page.service';

interface PlatformNote {
  title: string;
  story: string;
  tags: string;
  parts?: string[];
}

// Annotations for the platform diagram. Multi-component boxes list their
// sub-stories in `parts`; the panel renders those as an accordion.
const NOTES: Record<string, PlatformNote> = {
  clients: {
    title: 'Owning the glass too',
    story:
      'Fullstack means the interface is my problem as well. Each client technology here is real shipped work - Angular, React, and Android. Their stories follow.',
    tags: 'FRONTEND / FULLSTACK',
    parts: ['angular', 'react', 'android'],
  },
  angular: {
    title: 'Angular: structure before surface',
    story:
      'I use Angular for UI that needs clear boundaries and maintainable state. Standalone components, signals, OnPush change detection, and isolated heavy work keep the code readable as features grow.',
    tags: 'ANGULAR 19 / SIGNALS / ONPUSH / ARCHITECTURE',
  },
  react: {
    title: 'React: a component library teams reused',
    story:
      'At BJIT I built a ReactJS component library - charts, animated sections, parallax - that was reused across multiple products. Building for other developers is a different discipline than building screens: APIs, docs, and edge cases matter more than pixels.',
    tags: 'REACT / COMPONENT LIBRARY / DX',
  },
  android: {
    title: 'Android: leading a team to an on-time MVP',
    story:
      'At Digitruck I led four engineers shipping a logistics platform MVP from zero. I designed the full MVVM architecture with Android Jetpack before the first line of feature code, then we shipped registration, orders, ratings, analytics, and localization in a single sprint cycle - on time.',
    tags: 'ANDROID / KOTLIN / MVVM / TEAM LEAD',
  },
  keycloak: {
    title: 'Centralized identity with Keycloak',
    story:
      'Every service was on the path to reinventing login, tokens, and permissions on its own. I wired Keycloak across the stack so authentication and authorization live in one place: services trust tokens, not passwords. The trade-off was an extra hop and a learning curve up front; the payoff is that adding a new service costs nothing in auth code.',
    tags: 'KEYCLOAK / OAUTH2 / SPRING SECURITY',
  },
  services: {
    title: 'The services themselves',
    story:
      'I own the backend end to end: Kotlin and Spring Boot services carrying real production traffic. Ownership means everything from API design to the 3am pager. Several bugs had survived in production for years; I hunted them down and added the tests that keep them dead.',
    tags: 'KOTLIN / SPRING BOOT / PRODUCTION OWNERSHIP',
  },
  migration: {
    title: 'AWS to Azure, live',
    story:
      'The business needed to move clouds without stopping. I led the migration of running production services from AWS to Azure: inventory, parallel environments, cutover plan, rollback plan. Production stayed up. Nobody noticed the move - which was the entire point.',
    tags: 'AZURE / MIGRATION / ZERO DOWNTIME',
  },
  cdc: {
    title: 'From fragile polling to change data capture',
    story:
      'Services stayed in sync by polling each other, and every failure window meant drift and manual cleanup. I replaced polling with an event backbone built from two parts.',
    tags: 'EVENT-DRIVEN CONSISTENCY',
    parts: ['kafka', 'debezium'],
  },
  kafka: {
    title: 'Kafka: the event backbone',
    story:
      'Kafka carries the change events between services. The hard part was ordering and replay semantics; getting them right removed a whole class of recurring incidents.',
    tags: 'KAFKA / ORDERING / REPLAY',
  },
  debezium: {
    title: 'Debezium: changes from the database log itself',
    story:
      'Debezium reads changes straight from the database log, so consumers stay consistent even through crashes and restarts - no polling, no drift, no manual cleanup.',
    tags: 'DEBEZIUM / CDC / CONSISTENCY',
  },
  postgres: {
    title: 'Hierarchies without recursive CTE soup',
    story:
      'The domain is deeply hierarchical, and the naive approach is recursive queries that get slower and harder to read every quarter. I modeled the hierarchy with PostgreSQL Ltree: paths become indexable values, and subtree queries become one-liners. Queries stayed clean and fast as the tree grew.',
    tags: 'POSTGRESQL / LTREE / DATA MODELING',
  },
  elastic: {
    title: 'Search over millions of records',
    story:
      'Users needed to find anything across millions of records, and the database was the wrong tool for it. I built the Elasticsearch layer: index design, ingestion from the event backbone, and query tuning. Results come back in well under a second, in production, every day.',
    tags: 'ELASTICSEARCH / INDEXING / SEARCH RELEVANCE',
  },
  storage: {
    title: 'The right store for the right data',
    story:
      'Not everything belongs in Postgres. Documents live in MongoDB, binaries in Azure Blob, and everything queryable stays relational. The discipline is in the boundaries: each store does what it is best at, and nothing is duplicated without a reason.',
    tags: 'MONGODB / POLYGLOT PERSISTENCE',
  },
  storage2: {
    title: 'Binaries belong in blob storage',
    story:
      'Large binary payloads were heading for the database, where they would bloat backups and slow every query around them. I routed them to Azure Blob with references from the relational side. Boring, correct, and cheap - exactly what storage should be.',
    tags: 'AZURE BLOB / STORAGE DESIGN',
  },
  cicd: {
    title: 'Pipelines the team actually trusts',
    story:
      'Deploys used to be manual and nervous. I made them boring - across two different pipeline stacks.',
    tags: 'CI/CD / AUTOMATION',
    parts: ['bitbucket', 'jenkins'],
  },
  bitbucket: {
    title: 'Bitbucket Pipelines: zero manual deploys',
    story:
      'I wrote the CI/CD pipelines - Bitbucket Pipelines plus shell - that took deploys to zero manual steps. Trust is the real feature: when the pipeline is green, the team ships without ceremony.',
    tags: 'BITBUCKET PIPELINES / SHELL / ZERO MANUAL DEPLOYS',
  },
  jenkins: {
    title: 'Jenkins: smoke tests that surface failures fast',
    story:
      'At BJIT I added smoke tests to the Jenkins pipeline, so critical failures surfaced in minutes instead of after a full QA pass.',
    tags: 'JENKINS / SMOKE TESTS',
  },
  observability: {
    title: 'Observability from scratch',
    story:
      'When something broke, finding out what and when took guesswork. I built the observability layer from nothing.',
    tags: 'OBSERVABILITY / ON-CALL',
    parts: ['prometheus', 'grafana'],
  },
  prometheus: {
    title: 'Prometheus: metrics and alerts that mean something',
    story:
      'I instrumented the services with Prometheus metrics and wrote the alert rules. Alerts fire on symptoms users feel, not on noise - so a page always means something.',
    tags: 'PROMETHEUS / METRICS / ALERTING',
  },
  grafana: {
    title: 'Grafana: dashboards on-call actually uses',
    story:
      'The Grafana dashboards show what broke and when at a glance. On-call knows before the users write in.',
    tags: 'GRAFANA / DASHBOARDS / ON-CALL',
  },
  quality: {
    title: 'Quality gates in the pipeline',
    story:
      'Bad code and vulnerable dependencies should never reach human review. I put machine gates into CI ahead of it.',
    tags: 'CI QUALITY GATES',
    parts: ['sonarqube', 'supplychain'],
  },
  sonarqube: {
    title: 'SonarQube: code quality as a hard gate',
    story:
      'SonarQube blocks merges on bugs, code smells, and coverage drops - the things a machine catches better than a reviewer. Reviewers spend their attention on design instead.',
    tags: 'SONARQUBE / STATIC ANALYSIS',
  },
  supplychain: {
    title: 'SBOM + Dependency-Track: the supply chain, watched',
    story:
      'Every build generates an SBOM that Dependency-Track scans for vulnerable dependencies. A risky dependency fails the build before anyone reviews the change.',
    tags: 'SBOM / DEPENDENCY-TRACK / SUPPLY CHAIN',
  },
};

@Component({
  selector: 'app-platform',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="platform" class="section">
      <div class="container container--wide">
        <header class="section-head">
          <span class="plate-eyebrow">02 - The Platform, Annotated</span>
          <h2 class="section-title">Turning Systems Knowledge into Architecture</h2>
          <div class="section-rule" aria-hidden="true"></div>
          <p class="platform__subcap mono">SELECT ANY COMPONENT TO READ WHAT I DID TO IT.</p>
        </header>

        <div class="platform__duo" [class.platform__duo--open]="note() !== null">
          <div class="diagram-scroll">
            <svg
              class="diagram"
              viewBox="0 0 760 512"
              role="group"
              aria-label="Architecture diagram of the production platform; each component opens an annotation"
              (click)="onActivate($event)"
              (keydown.enter)="onActivate($event)"
              (keydown.space)="onActivate($event)"
            >
              <!-- stack lanes: FRONTEND / BACKEND / DATA / DEVOPS -->
              <g aria-hidden="true">
                <text class="lane-label" x="726" y="37" text-anchor="end">FRONTEND</text>
                <line class="lane-sep" x1="26" y1="66" x2="734" y2="66"/>

                <rect class="lane-band" x="26" y="78" width="708" height="196" rx="2"/>
                <text class="lane-label" x="726" y="180" text-anchor="end">BACKEND</text>

                <line class="lane-sep" x1="26" y1="278" x2="734" y2="278"/>
                <text class="lane-label" x="726" y="340" text-anchor="end">DATA</text>

                <rect class="lane-band" x="26" y="394" width="708" height="80" rx="2"/>
                <line class="lane-sep" x1="26" y1="394" x2="734" y2="394"/>
                <text class="lane-label" x="726" y="466" text-anchor="end">DEVOPS</text>
              </g>

              <!-- cloud boundary (clickable: the migration story) -->
              <g
                class="node ext"
                data-id="migration"
                tabindex="0"
                role="button"
                [class.sel]="selected() === 'migration'"
                aria-label="Azure cloud boundary, migrated live from AWS - read annotation"
              >
                <rect x="22" y="74" width="716" height="404" rx="3" style="fill: none; pointer-events: stroke;"/>
                <text class="boundary-label" x="40" y="92">CLOUD PLATFORM</text>
              </g>

              <!-- CLIENTS -->
              <g
                class="node ext"
                data-id="clients"
                tabindex="0"
                role="button"
                [class.sel]="selected() === 'clients'"
                aria-label="Clients, web and mobile - read annotation"
              >
                <rect x="310" y="14" width="160" height="38" rx="2"/>
                <text x="390" y="30" text-anchor="middle">CLIENTS</text>
                <text class="sub" x="390" y="43" text-anchor="middle">ANGULAR &#183; REACT &#183; ANDROID</text>
              </g>

              <!-- wires -->
              <g aria-hidden="true">
                <path class="wire" d="M 390 58 V 104"/>
                <path class="arrowhead" d="M 390 104 l -3.5 -7 h 7 z"/>

                <path class="wire" d="M 390 140 V 180"/>
                <path class="arrowhead" d="M 390 180 l -3.5 -7 h 7 z"/>
                <text class="wire-label" x="398" y="164">AUTHENTICATED</text>

                <path class="wire" d="M 470 208 H 542"/>
                <path class="arrowhead" d="M 542 208 l -7 -3.5 v 7 z"/>
                <path class="wire" d="M 542 226 H 470"/>
                <path class="arrowhead" d="M 470 226 l 7 -3.5 v 7 z"/>
                <text class="wire-label" x="472" y="202" style="letter-spacing: 0.1em">EVENTS &#183; CDC</text>

                <path class="wire wire--dashed" d="M 168 208 H 308"/>
                <path class="arrowhead" d="M 308 208 l -7 -3.5 v 7 z"/>
                <text class="wire-label" x="180" y="202">DEPLOYS</text>

                <path class="wire" d="M 352 244 C 300 274, 190 274, 143 300"/>
                <path class="arrowhead" d="M 143 300 l 3 -7 4.5 6 z"/>
                <path class="wire" d="M 376 244 C 360 270, 330 276, 315 300"/>
                <path class="arrowhead" d="M 315 300 l 1 -7.5 5.8 4.8 z"/>
                <path class="wire" d="M 404 244 C 420 270, 448 276, 462 300"/>
                <path class="arrowhead" d="M 462 300 l -5.8 -4.8 7 -2.4 z"/>
                <path class="wire" d="M 428 244 C 480 274, 580 274, 625 300"/>
                <path class="arrowhead" d="M 625 300 l -7.5 -1 4.8 -5.8 z"/>
                <text class="wire-label" x="470" y="268">READS / WRITES</text>

                <path class="wire" d="M 622 244 C 622 266, 420 262, 330 300"/>
                <text class="wire-label" x="560" y="264">PROJECTIONS</text>

                <path class="wire wire--dashed" d="M 260 408 C 300 384, 350 270, 372 248"/>
                <path class="wire wire--dashed" d="M 300 424 H 542"/>
                <text class="wire-label" x="316" y="418">GATES BEFORE MERGE</text>
                <path class="arrowhead" d="M 542 424 l -7 -3.5 v 7 z"/>
                <text class="wire-label" x="188" y="384">OBSERVES</text>
              </g>

              <!-- EDGE -->
              <g
                class="node"
                data-id="keycloak"
                tabindex="0"
                role="button"
                [class.sel]="selected() === 'keycloak'"
                aria-label="Keycloak, edge and auth - read annotation"
              >
                <rect x="310" y="104" width="160" height="36" rx="2"/>
                <text x="390" y="120" text-anchor="middle">KEYCLOAK</text>
                <text class="sub" x="390" y="132" text-anchor="middle">CENTRAL IDENTITY &#183; OAUTH2</text>
              </g>

              <!-- CORE -->
              <g
                class="node"
                data-id="services"
                tabindex="0"
                role="button"
                [class.sel]="selected() === 'services'"
                aria-label="Kotlin Spring Boot services - read annotation"
              >
                <rect x="316" y="186" width="148" height="52" rx="2" transform="translate(6,6)" opacity="0.35"/>
                <rect x="313" y="183" width="148" height="52" rx="2" transform="translate(3,3)" opacity="0.6"/>
                <rect x="310" y="180" width="148" height="52" rx="2"/>
                <text x="384" y="200" text-anchor="middle">SERVICES</text>
                <text class="sub" x="384" y="214" text-anchor="middle">KOTLIN / SPRING BOOT &#183; xN</text>
              </g>
              <g
                class="node"
                data-id="cdc"
                tabindex="0"
                role="button"
                [class.sel]="selected() === 'cdc'"
                aria-label="Kafka and Debezium change data capture - read annotation"
              >
                <rect x="542" y="190" width="170" height="52" rx="2"/>
                <text x="627" y="210" text-anchor="middle">KAFKA + DEBEZIUM</text>
                <text class="sub" x="627" y="224" text-anchor="middle">CHANGE DATA CAPTURE</text>
              </g>
              <g
                class="node"
                data-id="cicd"
                tabindex="0"
                role="button"
                [class.sel]="selected() === 'cicd'"
                aria-label="CI CD pipelines - read annotation"
              >
                <rect x="48" y="190" width="120" height="36" rx="2"/>
                <text x="108" y="206" text-anchor="middle">CI / CD</text>
                <text class="sub" x="108" y="218" text-anchor="middle">BITBUCKET &#183; JENKINS</text>
              </g>

              <!-- DATA -->
              <g
                class="node"
                data-id="postgres"
                tabindex="0"
                role="button"
                [class.sel]="selected() === 'postgres'"
                aria-label="PostgreSQL with Ltree - read annotation"
              >
                <rect x="60" y="300" width="150" height="48" rx="2"/>
                <text x="135" y="320" text-anchor="middle">POSTGRESQL</text>
                <text class="sub" x="135" y="334" text-anchor="middle">LTREE HIERARCHIES</text>
              </g>
              <g
                class="node"
                data-id="elastic"
                tabindex="0"
                role="button"
                [class.sel]="selected() === 'elastic'"
                aria-label="Elasticsearch - read annotation"
              >
                <rect x="240" y="300" width="150" height="48" rx="2"/>
                <text x="315" y="320" text-anchor="middle">ELASTICSEARCH</text>
                <text class="sub" x="315" y="334" text-anchor="middle">SUB-SECOND SEARCH</text>
              </g>
              <g
                class="node"
                data-id="storage"
                tabindex="0"
                role="button"
                [class.sel]="selected() === 'storage'"
                aria-label="MongoDB - read annotation"
              >
                <rect x="420" y="300" width="90" height="48" rx="2"/>
                <text x="465" y="320" text-anchor="middle">MONGODB</text>
                <text class="sub" x="465" y="334" text-anchor="middle">DOCUMENTS</text>
              </g>
              <g
                class="node"
                data-id="storage2"
                tabindex="0"
                role="button"
                [class.sel]="selected() === 'storage2'"
                aria-label="Azure Blob storage - read annotation"
              >
                <rect x="540" y="300" width="110" height="48" rx="2"/>
                <text x="595" y="320" text-anchor="middle">AZURE BLOB</text>
                <text class="sub" x="595" y="334" text-anchor="middle">BINARIES</text>
              </g>

              <!-- OPS -->
              <g
                class="node"
                data-id="observability"
                tabindex="0"
                role="button"
                [class.sel]="selected() === 'observability'"
                aria-label="Prometheus and Grafana observability - read annotation"
              >
                <rect x="90" y="408" width="170" height="44" rx="2"/>
                <text x="175" y="426" text-anchor="middle">PROMETHEUS + GRAFANA</text>
                <text class="sub" x="175" y="440" text-anchor="middle">BUILT FROM SCRATCH</text>
              </g>
              <g
                class="node"
                data-id="quality"
                tabindex="0"
                role="button"
                [class.sel]="selected() === 'quality'"
                aria-label="Quality gates in CI - read annotation"
              >
                <rect x="542" y="404" width="170" height="44" rx="2"/>
                <text x="627" y="422" text-anchor="middle">QUALITY GATES</text>
                <text class="sub" x="627" y="436" text-anchor="middle">SONARQUBE &#183; SBOM &#183; DEP-TRACK</text>
              </g>

              <text class="boundary-label" x="380" y="502" text-anchor="middle" style="letter-spacing: 0.22em">
                FIG. 0 - DEPLOYMENT VIEW, ANNOTATED BY THE ENGINEER WHO RUNS IT
              </text>

              <!-- traveling request dot: CSS motion path over the exact wire curves
                   (SMIL never starts inside display:none pages) -->
              <g class="dot-layer" aria-hidden="true">
                <circle class="dot" r="3" fill="#0f6e66" fill-opacity="0.75"/>
              </g>
            </svg>
          </div>

          <div class="plate platform__panel" [class.is-empty]="note() === null" aria-live="polite">
            <button class="panel__close mono" type="button" aria-label="Close annotation" (click)="selected.set(null)">
              &#215;
            </button>
            <div class="panel__scroll" #panelScroll (scroll)="updateMore()">
              @for (n of [note()]; track selected()) {
                @if (n) {
                  <div class="panel__inner">
                    <p class="panel__eyebrow">Annotation - what I did here</p>
                    <h3 class="panel__title">{{ n.title }}</h3>
                    <p class="panel__story">{{ n.story }}</p>
                    <p class="panel__tags">{{ n.tags }}</p>
                    @for (pid of n.parts ?? []; track pid; let first = $first) {
                      <details class="panel__part" name="parts" [attr.open]="first ? '' : null" (toggle)="updateMore()">
                        <summary>{{ notes[pid].title }}</summary>
                        <p class="panel__story">{{ notes[pid].story }}</p>
                        <p class="panel__tags">{{ notes[pid].tags }}</p>
                      </details>
                    }
                  </div>
                }
              }
            </div>
            <div class="panel__more" [class.panel__more--on]="hasMore()" aria-hidden="true">MORE</div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './platform.component.scss',
})
export class PlatformComponent {
  protected readonly notes = NOTES;
  protected readonly selected = signal<string | null>('clients');
  protected readonly note = computed(() => {
    const id = this.selected();
    return id ? NOTES[id] : null;
  });
  protected readonly hasMore = signal(false);

  private readonly panelScroll = viewChild<ElementRef<HTMLElement>>('panelScroll');

  constructor() {
    // clients is selected by default: measure the MORE indicator once rendered
    afterNextRender(() => this.updateMore());
    // sizes are 0 while the page is hidden - re-measure when it becomes visible
    const pageService = inject(PageService);
    effect(() => {
      if (pageService.page() === 'platform') {
        requestAnimationFrame(() => this.updateMore());
      }
    });
  }

  protected onActivate(event: Event): void {
    const node = (event.target as Element).closest('[data-id]');
    if (!node) return;
    event.preventDefault();
    this.selected.set(node.getAttribute('data-id'));
    // measure overflow after Angular has rendered the new annotation
    requestAnimationFrame(() => {
      const el = this.panelScroll()?.nativeElement;
      if (el) el.scrollTop = 0;
      this.updateMore();
    });
  }

  @HostListener('window:resize')
  protected updateMore(): void {
    const el = this.panelScroll()?.nativeElement;
    if (!el) return;
    this.hasMore.set(el.scrollTop + el.clientHeight < el.scrollHeight - 8);
  }
}
