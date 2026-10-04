# Case Vault UI

The front end of [Case Vault](https://www.hohjd.com), a case interview practice app, with no backend: no accounts, no paywall, no server calls. Every section is unlocked and progress is saved in the browser's localStorage.

What's inside: full cases with spaced recall, case maths lessons, framework drills, sector notes, flashcards, timed mental maths, and an interview guide.

```sh
npm ci
npm run dev     # local dev server
npm test        # unit tests (Node's built-in runner)
npm run build   # static build in dist/
```

The build is a static site, so it deploys to any static host. `vercel.json` adds the SPA rewrites for Vercel.

See `AGENTS.md` for how the content and practice logic are organised.
