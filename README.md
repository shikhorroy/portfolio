# Shikhor Kumer Roy - Portfolio

A clean, futuristic Angular 19 portfolio with dark/light themes. Designed so every
colour lives in one place - swap themes or retune the palette from
[`src/styles/_tokens.scss`](src/styles/_tokens.scss).

## Run locally

```bash
npm install
npm start
# http://localhost:4200
```

## Project structure

```
src/
├── app/
│   ├── core/
│   │   ├── data/resume.data.ts       # single source of truth for all content
│   │   └── services/theme.service.ts # signal-based theme toggle, localStorage
│   ├── shared/
│   │   ├── nav-bar/                  # floating glass nav + scroll spy
│   │   └── theme-toggle/             # dark/light toggle button
│   ├── sections/
│   │   ├── hero/
│   │   ├── about/
│   │   ├── skills/
│   │   ├── experience/
│   │   ├── projects/
│   │   ├── education/
│   │   └── contact/
│   ├── app.component.*               # shell + animated backdrop (grid + aurora)
│   └── app.config.ts
├── styles/
│   ├── _tokens.scss                  # THEME TOKENS - edit here to rebrand
│   ├── _reset.scss
│   └── _utilities.scss               # layout, buttons, chips, surfaces
└── styles.scss
```

### Changing the theme / colours

All theme-able values are CSS custom properties declared in
[`src/styles/_tokens.scss`](src/styles/_tokens.scss):

- `:root[data-theme='dark']` - default dark palette
- `:root[data-theme='light']` - light palette

Tweak `--accent-1`, `--accent-2`, `--bg-base`, `--text-strong`, etc. and the
whole UI updates at runtime. To add a third theme, declare another block like
`:root[data-theme='neon']` and have `ThemeService` write that value to
`data-theme` on `<html>`.

### Updating content

Edit [`src/app/core/data/resume.data.ts`](src/app/core/data/resume.data.ts).
Sections render off that single object.

## Deploy to GitHub Pages

### Option 1: GitHub Actions (recommended)

A workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
builds and deploys automatically when you push to `main`.

1. Create a GitHub repo and push this project.
2. In the repo → **Settings → Pages → Build and deployment → Source:
   GitHub Actions**.
3. Push to `main`. The site publishes at
   `https://<your-username>.github.io/<repo-name>/`.

The workflow auto-sets `--base-href` from the repo name, so you don't need
to hard-code anything.

### Option 2: Manual deploy from your machine

```bash
npm install --save-dev angular-cli-ghpages
REPO_NAME=<your-repo> npm run deploy
```

This builds with the correct base-href and pushes the output to the
`gh-pages` branch. Then set **Settings → Pages → Source** to
`Deploy from branch: gh-pages / (root)`.

### If you deploy to `<username>.github.io` (root)

No subpath is needed. Build with a root base-href:

```bash
ng build --configuration production --base-href "/"
```

Then serve `dist/portfolio/browser/`.

## Credits

Built with Angular 19, SCSS, signals, and a lot of CSS variables.
