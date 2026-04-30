# Deployment

This site is an Astro static site deployed with GitHub Pages.

## Current Setup

- Repository: `allensu02/personal-website`
- Production domain: `https://www.allensu.xyz`
- Deploy trigger: every push to `main`
- Workflow: `.github/workflows/deploy.yml`
- Build command: `npm run build`
- Output directory: `dist/`

The GitHub Actions workflow uses `withastro/action@v5` to install dependencies, build the site, upload the generated `dist/` folder, and then deploy it with `actions/deploy-pages@v4`.

## First-Time GitHub Pages Setup

In the GitHub repo:

1. Go to `Settings` -> `Pages`.
2. Set `Source` to `GitHub Actions`.
3. Set the custom domain to `www.allensu.xyz`.
4. Make sure DNS for `www.allensu.xyz` points to GitHub Pages.
5. Enable `Enforce HTTPS` once GitHub finishes provisioning the certificate.

The repo has `public/CNAME`, so Astro copies the custom domain file into `dist/CNAME` during builds.

## Deploying Changes

From the repo root:

```sh
npm install
npm run build
git status
git add .
git commit -m "Update site"
git push origin main
```

After pushing, open the repo's `Actions` tab and watch the `Deploy to GitHub Pages` workflow. When it succeeds, the site should be live at:

```text
https://www.allensu.xyz
```

## Local Preview

For development:

```sh
npm run dev
```

For a production-style local check:

```sh
npm run build
npm run preview
```

## If You Do Not Want the Custom Domain

If deploying only to `https://allensu02.github.io/personal-website`, change `astro.config.mjs` to:

```js
export default defineConfig({
  site: 'https://allensu02.github.io',
  base: '/personal-website',
});
```

Then remove `public/CNAME` and clear the custom domain in GitHub Pages settings.
