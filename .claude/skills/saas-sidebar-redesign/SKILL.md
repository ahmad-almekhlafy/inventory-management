---
name: saas-sidebar-redesign
description: Redesign a Vue 3 application's UI into a modern, polished SaaS-style interface. Replaces a top navigation bar with a vertical left sidebar, introduces a consistent spacing/typography/color token system, and restyles the shell and pages so they look like a professional product (Linear, Vercel, or Stripe dashboard feel). Use this skill whenever the user wants to modernize, restyle, "make professional", or overhaul the look of a Vue app, move navigation into a sidebar, fix inconsistent spacing across pages, or give a Vue dashboard/admin panel a SaaS look, even if they don't say "SaaS" or "sidebar" explicitly.
---

# SaaS Sidebar Redesign for Vue 3

Turn an existing Vue 3 app into a cohesive SaaS-style product: a left sidebar for navigation, a slim header for page context and global controls, and a content area where every page follows the same spacing and component rules.

This is a **visual and structural** redesign. Users hand you working apps. If the app looks great but a filter stops working, a route disappears, or a translation key breaks, the redesign has failed. Keep behavior identical and change presentation only.

## Workflow

Work through these phases in order. Each one depends on what the previous phase found.

### 1. Discover (read before you touch anything)

Build a picture of how the app is put together. Look for:

- **Project rules.** Read `CLAUDE.md` files (root and `client/`) and `.claude/agents/`. Projects often have rules that override your defaults, for example "delegate .vue edits to a specific subagent", "no emojis in UI", a mandated color palette, or "use unique keys in v-for". Follow them throughout. If the project requires delegating `.vue` work to a subagent, pass that subagent this skill's layout spec and token list (or the path to `references/design-system.md`) so it doesn't redesign from scratch.
- **The app shell.** Usually `App.vue` or a `layouts/` component. Find the current top nav, any secondary bars (filters, breadcrumbs), the `<router-view>`, and globally mounted modals.
- **Routes.** Read the router config (`main.js`, `router/index.js`). Every route that appears in the current nav must appear in the sidebar. Note routes that exist but aren't linked; mention them in the report, but don't add them unless asked.
- **Global styles.** Find where shared CSS lives (an unscoped `<style>` in `App.vue`, `style.css`, `assets/main.css`) and any existing CSS variables, fonts, and palette.
- **Nav labels.** If labels come from i18n (`t('nav.x')`), keep using the same keys. Never hardcode strings that were translated.
- **Header controls.** Language switchers, profile menus, notifications, and global filters all need a new home.
- **Dependencies.** Check `package.json`. Don't add UI frameworks, icon packages, or CSS libraries unless the user agrees. Inline SVG icons and plain CSS are enough.

Then **capture a baseline**. If the dev server is running (or you can start it), screenshot each route and note the browser console errors that already exist. You'll need these later so you don't blame pre-existing problems on the redesign, or miss new ones.

### 2. Plan the layout

Default target layout (adapt it if discovery shows a strong reason):

```
+-----------+--------------------------------------------------+
| Logo/name |  Page title            [filters] [lang] [profile] |  <- header (56-64px, sticky)
|           +--------------------------------------------------+
| Nav item  |                                                  |
| Nav item  |   Page content                                   |
| Nav item  |   (max-width ~1440px, 24-32px padding)           |
| ...       |                                                  |
|           |                                                  |
| --------- |                                                  |
| Collapse  |                                                  |
+-----------+--------------------------------------------------+
  240px (64px when collapsed)
```

- **Sidebar:** fixed full height, 240px wide, collapsible to a 64px icon rail. Logo/product name at the top, nav items in the middle, a collapse toggle (and optionally the user/profile entry) at the bottom. Group items under small uppercase section labels when there are more than about 7.
- **Header:** lives inside the content column, not across the full width. It holds the page title on the left and global controls (filters, language, profile) on the right. Global filter bars belong here as a compact row, or as a second slim row directly under the header if they don't fit.
- **Content:** a consistent page container (padding, max-width) wraps every route. The pages themselves shouldn't each reinvent outer padding.
- **Mobile (<768px):** the sidebar becomes an off-canvas drawer opened from a menu button in the header, with a backdrop and closing on Escape or route change.

Use CSS Grid for the shell (`grid-template-columns: var(--sidebar-w) 1fr`) and animate the width variable when collapsing. Persist the collapsed state in `localStorage` so it survives reloads.

### 3. Establish design tokens first

Before restyling any component, define tokens as CSS custom properties on `:root` in the global stylesheet. See `references/design-system.md` for the full token set, component specs, and icon guidance. Read it now.

Tokens come first because inconsistency is the main thing that makes an app look amateur: 13px padding here, 18px there, five slightly different grays. With a token scale in place, every later change snaps to the same grid. If the project already has a palette (for example a documented slate scale), map the tokens onto it instead of inventing new colors.

### 4. Implement, shell outward

1. **Tokens and base styles:** `:root` variables, body font and background, focus-visible ring.
2. **Shell:** new grid layout in `App.vue` (or a new `AppLayout.vue` if the shell is complex), with the old top nav removed.
3. **Sidebar component** (`components/AppSidebar.vue`): nav items built from one array (`{ to, labelKey, icon }`), so adding a route is a one-line change. Use `router-link` with `exact-active-class` for `/` and `active-class` for the others, so the overview item isn't highlighted on every page. Set `aria-current="page"` (router-link does this automatically) and `aria-label` on the `<nav>`. In collapsed mode, show the label as a `title` tooltip.
4. **Header component** (`components/AppHeader.vue`): page title derived from the route (route `meta.title`/`meta.titleKey` if present, otherwise the nav item's label), the mobile menu button, and the relocated global controls.
5. **Consistency sweep across views:** cards, tables, buttons, badges, inputs, modals, and page headers. Replace hardcoded spacing, radius, shadow and color values with tokens. This is where most of the polish comes from, so don't skip it. Restyle only; don't restructure view logic.

Make edits incrementally and re-check in the browser after the shell is done. A broken shell hides every other problem.

### 5. Verify

- `npm run build` (or the project's build command) succeeds.
- Every route loads from the sidebar, the active state highlights the right item, and the overview/home item isn't permanently active.
- Collapse/expand works and persists across a reload. At 375px width, the drawer opens and closes and the content doesn't scroll horizontally.
- Global controls (filters, language switch, profile menu, modals) still work. Change a filter and confirm the data updates.
- The browser console shows no **new** errors or warnings compared with the baseline.
- Take screenshots of each route at desktop width (1440px) and of one route at mobile width, so the user can review them.

If the project uses Playwright MCP tools for browser testing, use those.

### 6. Report

Tell the user briefly:
- what changed structurally (new components, removed top nav, where the header controls went)
- the token system and where it lives
- the screenshots (paths or inline)
- anything you noticed but deliberately left alone (pre-existing console errors, unlinked routes, broken features), so they know it isn't a regression

## Things that commonly go wrong

- **Every nav item highlighted or none highlighted.** This is caused by `active-class` matching on `/`. Use exact matching for the root route.
- **Double scrollbars or a sidebar that scrolls away.** Make the sidebar `position: sticky; top: 0; height: 100vh` inside the grid (or fixed), and let only the main column scroll.
- **Modals clipped or underneath the sidebar.** Global modals need a z-index above the sidebar and header (see the z-index tokens), and must not be rendered inside a container with `overflow: hidden`.
- **Content jumping on collapse.** Transition `grid-template-columns` or the width variable, not `display`.
- **Page titles that ignore i18n.** Derive the header title from the same translation keys the sidebar uses.
- **Restyling scoped styles you can't see.** Many views have `<style scoped>` blocks with hardcoded values. Tokens only help if you also replace those values during the sweep.
