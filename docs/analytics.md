# Website analytics

PostHog runs through the shared layout on all HTML pages. It captures pageviews,
page leaves, and clicks on links and buttons (including navigation, PDFs, GitHub,
and the colors panel buttons). It uses PostHog's anonymous browser ID to connect
activity across pages and returning visits. No `identify` call is made, and
session replay, surveys, heatmaps, and error/performance capture are disabled.
PostHog's normal GeoIP processing remains available for approximate locations.

## Connect the project

1. Create a PostHog project or open an existing project's settings.
2. Copy its **public project token** and ingestion host from the web install
   snippet. Use `https://us.i.posthog.com` for US projects or
   `https://eu.i.posthog.com` for EU projects. Do not use a personal API key.
3. Update `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` in
   `.github/workflows/deploy.yml`. The deployment currently uses the existing
   US Cloud **Default project** (297205), as requested by the site owner.
4. Run the Deploy to GitHub Pages workflow (or push to `main`) to rebuild.

Both values are intentionally public in the compiled browser code. Local `.env`
files are ignored and are not available to GitHub Actions. `.env.example` lists
the same variables for local build checks. Tracking stays inactive when either
value is absent, during development, and on hosts other than `allensu.xyz` and
`www.allensu.xyz`.

This project also contains earlier data. Filter events by `$host =
www.allensu.xyz` (or `allensu.xyz`) to isolate this website's activity.

## Verify after deployment

Open the live site, visit Before, click a paper or GitHub link, and open/reset the
colors panel. In PostHog's live events view, confirm `$pageview`, `$pageleave`, and
`$autocapture` events arrive. Click event properties include the element text and
link destination. Check that pageviews across navigation share a distinct ID and
session ID. Tracking blockers can prevent events from arriving.

For click totals, filter `$autocapture` by element text or link URL. For individual
anonymous journeys, use the event's distinct ID or session ID. PDF link clicks
are tracked; the PDF document itself does not execute website analytics.

Official references: [Astro integration](https://posthog.com/docs/libraries/astro),
[SDK configuration](https://posthog.com/docs/libraries/js/config), and
[anonymous events](https://posthog.com/docs/data/anonymous-vs-identified-events).
