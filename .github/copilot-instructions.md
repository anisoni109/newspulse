# NewsReels Project Instructions

## Project Overview
A React + Vite + Tailwind CSS webapp inspired by InShorts that displays news stories in a clean, scrollable card feed with infinite scrolling.

## Tech Stack
- **React 18** — UI framework
- **Vite** — Build tool & dev server
- **Tailwind CSS 3** — Styling
- **GitHub Pages** — Hosting (via Actions workflow)

## Project Structure
```
├── src/
│   ├── App.jsx          # Main app with infinite scroll feed
│   ├── main.jsx         # Entry point
│   └── tailwind.css     # Tailwind directives + base styles
├── index.html           # HTML shell
├── package.json         # Dependencies & scripts
├── vite.config.js       # Vite config (set base for GH Pages)
├── tailwind.config.js   # Tailwind config
├── postcss.config.js    # PostCSS config
└── .github/workflows/deploy.yml  # GitHub Pages CI/CD
```

## Commands
- `npm install` — Install dependencies
- `npm run dev` — Start dev server (localhost:5173)
- `npm run build` — Build for production (outputs to dist/)
- `npm run preview` — Preview production build locally

## Key Features
- **Infinite scroll**: Automatically loads 5 more stories when user scrolls near bottom using IntersectionObserver
- **Refresh button**: Top-right refresh button reloads all stories with fresh content
- **Share button**: Each card has a share button (uses Web Share API or copies to clipboard)
- **Auto-generated stories**: Stories are generated dynamically via `generateStory()` function with varied categories, sources, and headlines
- **Skeleton loading**: Shows placeholder cards while new content loads

## GitHub Pages Deployment
1. Create a GitHub repo named `news-reels` (or your preferred name)
2. Push code: `git init`, `git add .`, `git commit -m "initial"`, `git branch -M main`, `git remote add origin git@github.com:USERNAME/news-reels.git`, `git push -u origin main`
3. Update `vite.config.js` base path to `/news-reels/` (or your repo name) for user/org pages, keep as `/` for project pages
4. Go to repo Settings → Pages → Source: GitHub Actions
5. The workflow in `.github/workflows/deploy.yml` will auto-deploy on every push to `main`

## Code Conventions
- All logic is in a single `App.jsx` file (keep it that way for simplicity)
- Stories are generated via `generateStory()` function — modify templates/keywords there to change content style
- Use Tailwind utility classes exclusively; no custom CSS beyond base styles in `tailwind.css`
- Work through each checklist item systematically.
- Keep communication concise and focused.
- Follow development best practices.